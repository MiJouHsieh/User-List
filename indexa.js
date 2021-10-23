const BASE_URL = 'https://lighthouse-user-api.herokuapp.com'
const INDEX_URL = BASE_URL + '/api/v1/users/'

const users = []
let filteredUsers = []
const dataPanel = document.querySelector('#data-panel')
const searchForm = document.querySelector('#search-form')
const modalFooter = document.querySelector(".modal-footer")
const formInput = document.querySelector('#form-input')
const USERS_PER_PAGE = 12
const paginator = document.querySelector('#paginator')

//render users
function renderUserList(data) {
  let rawHTML = ``;
  data.forEach((item) => {
    
    rawHTML += `
      <div class="col-sm-2">
        <div class="mb-3">
          <div class="card border-0">
            <img src="${item.avatar}" data-id="${item.id}" data-toggle="modal" data-target="#user-modal" class="card-img-top user-portraits" alt="portraits">
            
            <div class='text-center card-text'>
              <a href='##'><i class='fas fa-heart' data-id='${item.id}'></i></a>
            </div>
            
            <div class="card-body text-center text-justify">
              <h6 class="card-title ">${item.name} ${item.surname}</h6>
            </div>
          </div>
      </div>
    </div>
    `;
  });
  dataPanel.innerHTML = rawHTML;
}

//modal
function showUserData(id) {
  const userModalName = document.querySelector("#user-modal-name");
  const userModalImage = document.querySelector("#user-modal-image");
  const userModalRegion = document.querySelector("#user-modal-region");
  const userModalGender = document.querySelector("#user-modal-gender");
  const userModalAge = document.querySelector("#user-modal-age");
  const userModalBirthday = document.querySelector("#user-modal-birthday");
  const userModalEmail = document.querySelector("#user-modal-email");
  const userModalCreatedAt = document.querySelector("#user-created-at");
  const userModalUpdatedAt = document.querySelector("#user-updated-at");

  axios
    .get(INDEX_URL + id)
    .then((response) => {
      const data = response.data;
      
      userModalName.innerText = `${data.name} ${data.surname}`;
      userModalGender.innerText = data.gender;
      userModalAge.innerText = data.age;
      userModalBirthday.innerText = data.birthday;
      userModalEmail.innerText = data.email;
      userModalRegion.innerText = data.region;
      userModalCreatedAt.innerText = data.created_at;
      userModalUpdatedAt.innerText = data.updated_at;
      userModalImage.innerHTML = `<img src="${data.avatar}" alt="portrait" class="img-fluid card-img-top">`

      let rawHTML = ``
      rawHTML =
        `<div class="btn modal-footer">
          <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
          <button type="button" class="btn">
            <a href='##'><i class='fas fa-heart modal-heart' data-id="${data.id}"></i>
          </button>
        </div>`
      modalFooter.innerHTML = rawHTML
    })
    .catch((error) => console.log(error))
}

function addToLike(id) {
  const list = JSON.parse(localStorage.getItem("like Users")) || [];
  const user = users.find((user) => user.id === id);
  if (list.some((user) => user.id === id)) {
    return alert(`${user.name} ${user.surname} ` + "is added to the Favorite list");
  }
  list.push(user);
  localStorage.setItem("like Users", JSON.stringify(list))
}

function getUsersByPage(page) {
  const data = filteredUsers.length ? filteredUsers : users
  const startIndex = (page-1) * USERS_PER_PAGE
  return users.slice(startIndex, startIndex + USERS_PER_PAGE)
}

function renderPaginator(amount) {
  const numberOfPages = Math.ceil(amount/USERS_PER_PAGE)
  let rawHTML = ``
  for(let page = 1; page <= numberOfPages; page++) {
    rawHTML +=
      `<li class="page-item"><a class="page-link" href="#" data-page='${page}'>${page}</a></li>`
  }
  paginator.innerHTML = rawHTML
}

dataPanel.addEventListener("click", function clickedOnPortrait(event) {
  if (event.target.matches(".user-portraits")) {
    showUserData(Number(event.target.dataset.id))
  } else if (event.target.matches('.fas.fa-heart')) {
    addToLike(Number(event.target.dataset.id))
  } 
})

modalFooter.addEventListener("click", function clickedOnModal(event) {
  if (event.target.matches('.fas.fa-heart.modal-heart')) {
    addToLike(Number(event.target.dataset.id))
  }
})

searchForm.addEventListener('submit', function clickedOnSubmit(event) {
  event.preventDefault()
  const keyword = formInput.value.trim().toLowerCase();
  
  filteredUsers = users.filter((user) =>
    ((user.name)+(user.surname)).toLowerCase().includes(keyword)
  )
  
  renderUserList(getUsersByPage(1))
  renderPaginator(filteredUsers.length)
  
  if (filteredUsers.length === 0) {
    renderUserList(getUsersByPage(1))
    renderPaginator(filteredUsers.length)
    return alert('Cannot find users with name: ' + keyword) 
  }
})

paginator.addEventListener('click', function onPaginatorClicked(event) {
  if (event.target.tagName !== 'A') return
  const page = Number(event.target.dataset.page)
  renderUserList(getUsersByPage(page))
})

//API 串接資料
axios.get(INDEX_URL).then((response) => {
  users.push(...response.data.results)
  renderPaginator(users.length)
  renderUserList(getUsersByPage(1))
})

