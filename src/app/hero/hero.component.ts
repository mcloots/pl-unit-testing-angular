// @ts-nocheck
import { Component, Input, Output, EventEmitter } from "@angular/core";
import { Hero } from "../hero";
import { RouterLink } from "@angular/router";

@Component({
    selector: "app-hero",
    templateUrl: "./hero.component.html",
    styleUrls: ["./hero.component.css"],
    standalone: true,
    imports: [RouterLink],
})
export class HeroComponent {
  @Input() hero: Hero;
  @Output() delete = new EventEmitter();

  onDeleteClick($event): void {
    $event.stopPropagation();
    this.delete.next();
  }
}
