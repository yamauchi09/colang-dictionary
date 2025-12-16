let dictionary = [];

// 辞書読み込み
fetch('dictionary.json')
  .then(res => res.json())
  .then(data => dictionary = data);

// 正規化関数（日本語・人工言語両対応）
function normalize(text) {
  if (!text) return '';
  return text
    .toLowerCase()
    .replace(/[、，・〜（）()]/g, '')
    .trim();
}

// 意味が文字列でも配列でも対応
function matchMeaning(meaning, query) {
  if (Array.isArray(meaning)) {
    return meaning.some(m => normalize(m).includes(query));
  }
  return normalize(meaning).includes(query);
}

// 検索処理（双方向＋絞り込み）
function searchDictionary() {
  const query = normalize(document.getElementById('search').value);
  const pos = document.getElementById('posFilter').value;
  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  if (!query && !pos) return;

  const results = dictionary.filter(entry => {
    const wordMatch = normalize(entry.word).includes(query);
    const meaningMatch = matchMeaning(entry.meaning, query);
    const posMatch = !pos || entry.part_of_speech === pos;

    return (wordMatch || meaningMatch) && posMatch;
  });

  if (results.length === 0) {
    resultDiv.textContent = '一致する語が見つかりません。';
    return;
  }

  results.forEach(entry => {
    resultDiv.innerHTML += `
      <div class="entry">
        <h3>${entry.word}</h3>
        <p><strong>意味：</strong>${Array.isArray(entry.meaning) ? entry.meaning.join('、') : entry.meaning}</p>
        <p><strong>品詞：</strong>${entry.part_of_speech}</p>
        ${entry.example ? `<p><strong>例：</strong>${entry.example}</p>` : ''}
        ${entry.notes ? `<p><em>${entry.notes}</em></p>` : ''}
      </div>
      <hr>
    `;
  });
}

// イベント登録
document.getElementById('search').addEventListener('input', searchDictionary);
document.getElementById('posFilter').addEventListener('change', searchDictionary);
