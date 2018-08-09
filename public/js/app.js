console.log('smoke test')

let desc = document.getElementsByClassName('description');

for (let i = 0; i < desc.length; i++) {
  desc[i].addEventListener('click', descSwitchClassName);
}

function descSwitchClassName() {
  console.log(this);
  if (this.className === 'description') {
    this.className = 'active'
  } else if (this.className === 'active') {
    this.className = 'description'
  }
}