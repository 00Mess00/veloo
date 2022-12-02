import { Controller } from "@hotwired/stimulus"

export default class extends Controller {
  static targets = ["maps", "map"]

  connect() {
    this.mapsTarget.querySelector(`[id='0']`).style.display = "block";
  }
  displayItinerary(e) {
    this.mapTargets.forEach(map => map.style.display="none");
    const mapItinerary = this.mapsTarget.querySelector(`[id='${e.currentTarget.id}']`);
    mapItinerary.style.display = "block"
  }
}
