let dictionary = [];

fetch('dictionary.json')
  .then(response => response.json())
  .then(data => dictionary = data);

document.getElementById('search').addEventListener('input', function() {
  const query = this.value.toLowerCase();
  const results = dictionary.filter(entry =>
    entry.word.toLowerCase().includes(query)
  );

  const resultDiv = document.getElementById('result');
  resultDiv.innerHTML = '';

  if (results.length === 0) {
    resultDiv.innerHTML = '一致する単語が見つかりません。';
  } else {
    results.forEach(entry => {
      resultDiv.innerHTML += `
        <div class="entry">
          <h2>${entry.word}</h2>
          <p><strong>意味：</strong> ${entry.meaning}</p>
          <p><strong>品詞：</strong> ${entry.part_of_speech}</p>
          <p><strong>発音：</strong> ${entry.pronunciation}</p>
          <p><strong>例文：</strong> ${entry.example}</p>
          <p><em>${entry.notes}</em></p>
        </div>
        <hr>
      `;
    });
  }
});
