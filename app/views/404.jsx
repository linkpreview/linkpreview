
//import notFoundImg from 'images/not-found.png';

export default function render404Page({req, isPage, isEmbed}) {
  return `
  <div class="${!isEmbed ? 'container page-container notfound-container' : ''}">
      <div class="row">
          <div class="col col-md-12">
            <div class="error-404">
              <div>
                <p>The Page You are looking for doesn't exist. </p>
              </div>
              <div>
                
              </div>
              <p>Click below to go home</p>
              <a href="/">Home</a>
            </div>
          </div>
      </div>
  </div>
  `;
}
