document.addEventListener('DOMContentLoaded', async () => {
  const response = await fetch('/cryptos');
  const cryptos = await response.json();

  const tbody = document.querySelector('#cryptoTable tbody');
  cryptos.forEach(crypto => {
    const row = `
      <tr>
        <td>${crypto.name}</td>
        <td>${crypto.last}</td>
        <td>${crypto.buy}</td>
        <td>${crypto.sell}</td>
        <td>${crypto.volume}</td>
        <td>${crypto.base_unit}</td>
      </tr>
    `;
    tbody.innerHTML += row;
  });
});
