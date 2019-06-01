

export default function renderErrorPage(req, error ={}) {
  return `
    <div>
        <div class="error-500">
          <div>
            <p>Something went wrong on our side.</p>
          </div>
          ${__DEVSERVER__ ? error.message : ''}
          ${__DEVSERVER__ ? error.stack : ''}
        </div>

        <script>
          /*setTimeout(() => {
            var origin = window.location.origin;
            window.location.href = origin;
          }, 2000);*/
        </script>
    </div>
  `;
}
