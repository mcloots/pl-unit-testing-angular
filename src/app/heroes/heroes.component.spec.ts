import { of } from "rxjs";
import { HeroesComponent } from "./heroes.component"
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HeroService } from "../hero.service";
import { provideRouter } from "@angular/router";
import { By } from "@angular/platform-browser";
import { HeroComponent } from "../hero/hero.component";

describe('HeroesComponent', () => {
    let component: HeroesComponent;
    let HEROES;
    let mockHeroService;

    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8 },
            { id: 2, name: 'Wonderful Woman', strength: 24 },
            { id: 3, name: 'SuperDude', strength: 55 }
        ];

        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);

        component = new HeroesComponent(mockHeroService);
    });

    describe('delete', () => {
        it('should remove the indicated hero from the list', () => {
            mockHeroService.deleteHero.and.returnValue(of(true));
            component.heroes = HEROES;

            component.delete(HEROES[2]);

            expect(component.heroes.length).toBe(2);
        });

        it('should call deleteHero with the correct hero', () => {
            mockHeroService.deleteHero.and.returnValue(of(true));
            component.heroes = HEROES;

            component.delete(HEROES[2]);

            expect(mockHeroService.deleteHero).toHaveBeenCalledWith(HEROES[2]);
        });
    });
});

describe('HeroesComponent (shallow tests)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8 },
            { id: 2, name: 'Wonderful Woman', strength: 24 },
            { id: 3, name: 'SuperDude', strength: 55 }
        ];

        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
        TestBed.configureTestingModule({
            imports: [HeroesComponent],
            providers: [
                { provide: HeroService, useValue: mockHeroService },
                provideRouter([])
            ]
        });

        fixture = TestBed.createComponent(HeroesComponent);
    });

    //Component calls ngOnInit() which calls the getHeroes() method from an injected HeroService
    it('should set heroes correctly from the service', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        expect(fixture.componentInstance.heroes.length).toBe(3);
    });

    it('should create one li for each hero', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));
        fixture.detectChanges();

        expect(fixture.debugElement.queryAll(By.css("li")).length).toBe(3);
    });
});

describe('HeroesComponent (deep tests)', () => {
    let fixture: ComponentFixture<HeroesComponent>;
    let mockHeroService;
    let HEROES;

    beforeEach(() => {
        HEROES = [
            { id: 1, name: 'SpiderDude', strength: 8 },
            { id: 2, name: 'Wonderful Woman', strength: 24 },
            { id: 3, name: 'SuperDude', strength: 55 }
        ];

        mockHeroService = jasmine.createSpyObj(['getHeroes', 'addHero', 'deleteHero']);
        TestBed.configureTestingModule({
            imports: [HeroesComponent],
            providers: [
                { provide: HeroService, useValue: mockHeroService },
                provideRouter([])
            ]
        });

        fixture = TestBed.createComponent(HeroesComponent);
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        // run ngOnInit
        fixture.detectChanges();
    });

    it('should render each hero as a HeroComponent', () => {
        //Benefit of working with debugElement = point to directives/child components
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));
        expect(heroComponents.length).toEqual(3);

        for (let i = 0; i < heroComponents.length; i++) {
            expect((heroComponents[i].componentInstance as HeroComponent).hero).toEqual(HEROES[i]);
        }

    });

    it(`should call heroService.deleteHero when the Hero Component's 
        delete button is clicked`, () => {
        spyOn(fixture.componentInstance, 'delete');
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        fixture.detectChanges();

        // Our three hero components
        const heroComponents = fixture.debugElement.queryAll(By.directive(HeroComponent));

        // Triggering a click event on a button
        // heroComponents[0].query(By.css('button'))
        //     .triggerEventHandler('click', { stopPropagation: () => { } });

        // Emitting the delete event
        //(heroComponents[0].componentInstance as HeroComponent).delete.emit(undefined);
        
        // Raising the delete event
        heroComponents[0].triggerEventHandler('delete', undefined);

        expect(fixture.componentInstance.delete).toHaveBeenCalledWith(HEROES[0]);
    });

    // Test input box
    it('should add a new hero to the hero list when the add button is clicked', () => {
        mockHeroService.getHeroes.and.returnValue(of(HEROES));

        fixture.detectChanges();
        const name = "Mr. Ice";

        //addHero must return an Observable (we subscribe on it)
        mockHeroService.addHero.and.returnValue(of({id: 4, name: name, strength: 4}));
        const inputElement = fixture.debugElement.query(By.css('input')).nativeElement as HTMLInputElement;
        const addButton = fixture.debugElement.queryAll(By.css('button'))[0];

        inputElement.value = name; // Simulates typing the name in the input
        addButton.triggerEventHandler('click', null);

        fixture.detectChanges();

        const heroText = (fixture.debugElement.query(By.css('ul')).nativeElement as HTMLUListElement).textContent;
        expect(heroText).toContain(name);

    });
});