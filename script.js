class View {
	constructor() {
		this.app = document.getElementById('app')
		
    this.wraper = this.createElement("div", "wraper");
    this.searchInput = this.createElement("input", "searchInput");
	  this.repoListWrapper = this.createElement("div", "repList");
  	this.repoContainer = this.createElement("ul", "autofillList");
    this.repoList = this.createElement("ul", "rep");

    this.repoListWrapper.append(this.repoList);
    this.wraper.append(this.repoContainer);
    this.wraper.append(this.searchInput);
    this.app.append(this.wraper);
    this.app.append(this.repoListWrapper);
	}
	createElement(eTag, eClass) {
    const element = document.createElement(eTag);
    if (eClass) {
      element.classList.add(eClass);
    }
    return element;
  }

  repItem(data) {
    const repoItem = this.createElement('li', 'autofillItem');
    repoItem.textContent = data.name;
    this.repoContainer.append(repoItem);

    repoItem.addEventListener('click', this.repInfo.bind(this, data))
  }

  repInfo(data) {
    const info = this.createElement('li', 'repItem');
    const name = data.name,
        owner = data.owner.login,
        stars = data.stargazers_count;

				info.innerHTML = `<div class="info">
                    <p>Name: ${name}</p>
                    <p>Owner: ${owner}</p>
                    <p>Stars: ${stars}</p>
                </div>
                <button class="btnDelete">
                    &#9587;
                </button>`;

    this.repoList.append(info);

    info.addEventListener('click', function (e) {
     if(e.target.classList == 'btn-delete') info.remove()
    })
    this.searchInput.value = '';
    this.repoContainer.innerHTML = '';
  }
}


class Search {
  constructor(view) {
    this.view = view;
    this.view.searchInput.addEventListener("keyup", this.debounce(this.searchRepos.bind(this), 500));
  }

  async searchRepos() {
    const value = this.view.searchInput.value
    if (value) {
      return await fetch(`https://api.github.com/search/repositories?q=${value}+in:name&per_page=5`)
          .then((res) => {
            if (res.ok) {
              this.view.repoContainer.innerHTML = ''
              res.json().then(rep => {
                rep.items.forEach(r => this.view.repItem(r))
              })
            }
          })
    } else this.view.repoContainer.innerHTML = '';
  }

  debounce(fn, time) {
    let timer;
    return function (...args) {
      clearTimeout(timer);
      const fnCall = (...args) => {
        fn.apply(this, args);
      };
      timer = setTimeout(fnCall, time);
    };
  }
}
new Search(new View());
