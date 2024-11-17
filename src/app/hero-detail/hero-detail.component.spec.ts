import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroDetailComponent } from "./hero-detail.component";
import { HeroService } from "../hero.service";
import { ActivatedRoute } from "@angular/router";
import { Location } from "@angular/common";
import { of } from "rxjs";
import { FormsModule } from "@angular/forms";

describe('HeroDetailComponent', () => {
    let fixture: ComponentFixture<HeroDetailComponent>;
    let mockActivatedRoute, mockHeroService, mockLocation;

    beforeEach(() => {
        mockHeroService = jasmine.createSpyObj(['getHero', 'updateHero']);
        mockLocation = jasmine.createSpyObj(['back']);
        mockActivatedRoute = {
            snapshot: {
                paramMap: {
                    get: () => { return '3'; }
                }
            }
        };

        TestBed.configureTestingModule({
            imports: [],
            providers: [
                { provide: HeroService, useValue: mockHeroService },
                { provide: ActivatedRoute, useValue: mockActivatedRoute },
                { provide: Location, useValue: mockLocation },

            ]
        });

        fixture = TestBed.createComponent(HeroDetailComponent);

        mockHeroService.getHero.and.returnValue(of(
            {
                id: 3, name: 'SuperDude', strength: 100
            }
        ));
    });

    it('should render hero name in a h2 tag', () => {
        fixture.detectChanges();

        expect((fixture.nativeElement as HTMLHeadingElement)
        .querySelector('h2')?.textContent).toContain('SUPERDUDE');
    });
});