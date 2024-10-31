import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeroComponent } from './hero.component';
import { provideRouter } from '@angular/router';
import { By } from '@angular/platform-browser';

describe('HeroComponent (shallow tests)', () => {
    let fixture: ComponentFixture<HeroComponent>;

    beforeEach(()=> {
        // Even though Standalone Components make modules optional, 
        // the TestBed still comes with a testing module. 
        // It takes care of the test setup and provides all components, directives, pipes, and services 
        // for the test:
        TestBed.configureTestingModule({
            imports: [ HeroComponent ],
            providers: [provideRouter([])]
        });

        fixture = TestBed.createComponent(HeroComponent);
    });

    it('should have the correct hero', () => {
        fixture.componentInstance.hero = { id: 1, name : 'SuperTestDude', strength: 3};

        expect(fixture.componentInstance.hero.name).toEqual('SuperTestDude');
    });

    it('should render the hero name in an anchor tag', () => {
        fixture.componentInstance.hero = { id: 1, name : 'SuperTestDude', strength: 3};

        //Change detection must be enabled/executed in order to bind the hero properties!
        fixture.detectChanges();

        //Wrapper with extra functionality/properties similar to the nativeElement (#id, .id)
        // Through a debugElement we can access directives on that element --> routerLink!
        let deA = fixture.debugElement.query(By.css('a'));
        expect((deA.nativeElement as HTMLElement)?.textContent).toContain('SuperTestDude');

        // nativeElement --> get to the DOM
        let element = fixture.nativeElement as HTMLElement;
        expect(element.querySelector('a')?.textContent).toContain('SuperTestDude');
    });
}); 