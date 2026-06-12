fetch('/json/version.json')
  .then(res => res.json())
  .then(data => {
    const currentVersion = localStorage.getItem('siteVersion');

    if (!currentVersion) {
      // First visit → store version
      localStorage.setItem('siteVersion', data.version);
    } else if (data.version !== currentVersion) {
      // Show banner if version changed
      const refreshBanner = document.createElement('div');
      refreshBanner.innerHTML = `
        <div style="position:fixed;bottom:10px;left:50%;transform:translateX(-50%);
                    background:#333;color:#fff;padding:10px 20px;border-radius:5px;
                    font-family:sans-serif;z-index:9999;">
          New version available!
          <button style="margin-left:10px;padding:5px 10px;cursor:pointer;">Refresh</button>
        </div>
      `;
      document.body.appendChild(refreshBanner);

      refreshBanner.querySelector('button').addEventListener('click', () => {
        localStorage.setItem('siteVersion', data.version);
        location.reload(true);
      });
    }
  });
