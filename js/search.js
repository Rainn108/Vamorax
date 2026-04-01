// ===== SMART SEARCH (typo-tolerant) =====
import { fetchPresets, renderPresetCard } from './shop.js';

let _cachedPresets = null;
async function getPresets() {
  if (!_cachedPresets) _cachedPresets = await fetchPresets();
  return _cachedPresets;
}

function levenshtein(a, b) {
  const m = a.length, n = b.length;
  const dp = Array.from({ length: m + 1 }, (_, i) =>
    Array.from({ length: n + 1 }, (_, j) => i === 0 ? j : j === 0 ? i : 0));
  for (let i = 1; i <= m; i++)
    for (let j = 1; j <= n; j++)
      dp[i][j] = a[i-1] === b[j-1] ? dp[i-1][j-1] : 1 + Math.min(dp[i-1][j], dp[i][j-1], dp[i-1][j-1]);
  return dp[m][n];
}

function fuzzyScore(query, text) {
  query = query.toLowerCase(); text = text.toLowerCase();
  if (text.includes(query)) return 1;
  let score = 0;
  for (const qw of query.split(/\s+/))
    for (const tw of text.split(/\s+/)) {
      const maxLen = Math.max(qw.length, tw.length);
      if (maxLen > 0) score = Math.max(score, 1 - levenshtein(qw, tw) / maxLen);
    }
  return score;
}

export async function searchPresets(query) {
  if (!query.trim()) return [];
  const presets = await getPresets();
  return presets
    .map(p => ({
      ...p,
      score: Math.max(
        fuzzyScore(query, p.name),
        fuzzyScore(query, p.category),
        ...(p.tags||[]).map(t => fuzzyScore(query, t))
      )
    }))
    .filter(p => p.score > 0.4)
    .sort((a, b) => b.score - a.score);
}

export function initSearchPage() {
  const input = document.querySelector('.search-input');
  const suggestions = document.querySelector('.search-suggestions');
  const resultsGrid = document.querySelector('.search-results-grid');
  const resultsCount = document.querySelector('.search-results-count');
  if (!input) return;

  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(async () => {
      const q = input.value.trim();
      if (q.length < 2) { suggestions?.classList.remove('show'); return; }
      const results = await searchPresets(q);
      renderSuggestions(results.slice(0, 5), q);
      if (resultsGrid) renderResults(results, q);
    }, 200);
  });

  input.addEventListener('keydown', async e => {
    if (e.key === 'Enter') { suggestions?.classList.remove('show'); renderResults(await searchPresets(input.value), input.value); }
    if (e.key === 'Escape') suggestions?.classList.remove('show');
  });

  // Close suggestions when clicking outside
  document.addEventListener('click', e => {
    if (!e.target.closest('.search-wrap')) suggestions?.classList.remove('show');
  });

  function renderSuggestions(results, query) {
    if (!suggestions) return;
    if (!results.length) { suggestions.classList.remove('show'); return; }
    suggestions.innerHTML = results.map(p => `
      <div class="suggestion-item" onclick="document.querySelector('.search-input').value='${p.name}';document.querySelector('.search-suggestions').classList.remove('show')">
        <span>${highlightMatch(p.name, query)}</span>
        <span class="suggestion-cat">${p.category.replace('-', ' ')}</span>
      </div>
    `).join('');
    suggestions.classList.add('show');
  }

  function renderResults(results, query) {
    if (!resultsGrid) return;
    if (resultsCount) resultsCount.textContent = `${results.length} result${results.length !== 1 ? 's' : ''} for "${query}"`;
    if (!results.length) {
      resultsGrid.innerHTML = `<div style="grid-column:1/-1;text-align:center;padding:60px;color:var(--text-3);font-size:13px">
        <p>No presets found for "${query}"</p>
        <p style="margin-top:8px;font-size:12px">Try different keywords</p>
      </div>`;
      return;
    }
    resultsGrid.innerHTML = results.map(p => renderPresetCard(p)).join('');
  }
}

function highlightMatch(text, query) {
  const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return text.replace(new RegExp(`(${escaped})`, 'gi'),
    '<mark style="background:rgba(255,255,255,0.12);border-radius:2px;padding:0 2px">$1</mark>');
}
