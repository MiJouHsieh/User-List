const BASE_URL = "https://lighthouse-user-api.herokuapp.com";
const INDEX_URL = BASE_URL + "/api/v1/users/";


const users = JSON.parse(localStorage.getItem("like Users")) || []
const dataPanel = document.querySelector("#data-panel");
const searchForm = document.querySelector("#search-form");
const formInput = document.querySelector("#form-input")
const modalFooter = document.querySelector(".modal-footer")

//render的函式
function renderUserList(data) {
  let rawHTML = ``;
  data.forEach((item) => {
    rawHTML += `
      <div class="col-sm-2">
        <div class="mb-3">
          <div class="card border-0">
            <img src="${item.avatar}" data-id="${item.id}" data-toggle="modal" data-target="#user-modal" class="card-img-top fav-user-portraits" alt="portraits">
            
            <div class='text-center card-text'>
              
              <a href='##'><i class='fas fa-heart' data-id='${item.id}'></i></a>
              <a href='##'><i class='fas fa-heart-broken' data-id='${item.id}'></i></a>
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

//modal顯示user資料
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
      const data = response.data

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
            <a href='##'><i class='fas fa-heart-broken modal-heart' data-dismiss="modal" data-id="${data.id}"></i>
          </button>
        </div>`
      modalFooter.innerHTML = rawHTML
    })
    .catch((error) => {
      console.log(error);
    })
}

function removeFromFavorite(id) {
  if (!users) return
  const userIndex = users.findIndex((user) =>user.id === id)
  if (userIndex === -1) return

  users.splice(userIndex,1)
  localStorage.setItem('like Users', JSON.stringify(users))
  renderUserList(users)
}

dataPanel.addEventListener('click', function clickedOnPortrait(event) {
  if (event.target.matches('.fav-user-portraits')) {
    showUserData(Number(event.target.dataset.id))
  } else if (event.target.matches('.fas.fa-heart-broken')) {
    removeFromFavorite(Number(event.target.dataset.id))
  }
})

modalFooter.addEventListener("click", function clickedOnModal(event) {
  if (event.target.matches('.fas.fa-heart-broken.modal-heart')) {
    removeFromFavorite(Number(event.target.dataset.id))
  } 
})

renderUserList(users)