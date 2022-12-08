import { Controller } from "@hotwired/stimulus"

// Connects to data-controller="greet"
export default class extends Controller {
  static targets = ["message", "icons"]

  connect() {
  }

  fire() {
    this.messageTarget.innerText = "Merci de votre participation !"
    this.iconsTarget.style.display = "none"
  }
}
