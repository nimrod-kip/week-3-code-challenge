document.addEventListener("DOMContentLoaded", main);
const BASE_URL = "http://localhost:3000/posts";
let currentPostId = null;

function main() {
  displayPosts();
  addNewPostListener();
}

function displayPosts() {
  fetch(BASE_URL)
    .then(res => res.json())
    .then(posts => {
      const postList = document.getElementById("post-list");
      postList.innerHTML = "";

      posts.forEach(post => {
        const div = document.createElement("div");
        div.textContent = post.title;
        div.addEventListener("click", () => handlePostClick(post.id));
        postList.appendChild(div);
      });

      
      if (posts.length > 0) {
        handlePostClick(posts[0].id);
      }
    });
}

function handlePostClick(id) {
  fetch(`${BASE_URL}/${id}`)
    .then(res => res.json())
    .then(post => {
      currentPostId = post.id;

      const detail = document.getElementById("post-detail");
      detail.innerHTML = `
        <h2>${post.title}</h2>
        <img src="${post.image}" width="150" />
        <p><strong>Author:</strong> ${post.author}</p>
        <p>${post.content}</p>
        <button id="edit-btn">Edit</button>
        <button id="delete-btn">Delete</button>
      `;

      
      document.getElementById("edit-btn").addEventListener("click", () => showEditForm(post));

      // Delete button (Advanced)
      document.getElementById("delete-btn").addEventListener("click", () => deletePost(post.id));
    });
}

function addNewPostListener() {
  const form = document.getElementById("new-post-form");
  form.addEventListener("submit", e => {
    e.preventDefault();

    const newPost = {
      title: form.title.value,
      author: form.author.value,
      content: form.content.value,
      image: "https://via.placeholder.com/150"
    };

    fetch(BASE_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newPost)
    })
      .then(res => res.json())
      .then(() => {
        form.reset();
        displayPosts();
      });
  });
}


function showEditForm(post) {
  const editForm = document.getElementById("edit-post-form");
  editForm.classList.remove("hidden");
  editForm["edit-title"].value = post.title;
  editForm["edit-content"].value = post.content;

  editForm.onsubmit = e => {
    e.preventDefault();

    const updatedPost = {
      title: editForm["edit-title"].value,
      content: editForm["edit-content"].value
    };

    fetch(`${BASE_URL}/${currentPostId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updatedPost)
    })
      .then(() => {
        editForm.classList.add("hidden");
        displayPosts();
        handlePostClick(currentPostId);
      });
  };

  document.getElementById("cancel-edit").onclick = () => {
    editForm.classList.add("hidden");
  };
}


function deletePost(id) {
  fetch(`${BASE_URL}/${id}`, { method: "DELETE" })
    .then(() => {
      document.getElementById("post-detail").innerHTML = "<p>Select a post to see details.</p>";
      displayPosts();
    });
}

