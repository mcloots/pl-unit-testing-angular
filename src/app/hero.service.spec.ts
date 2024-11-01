import { inject, TestBed } from "@angular/core/testing";
import { HeroService } from "./hero.service";
import { MessageService } from "./message.service";
import { HttpTestingController, provideHttpClientTesting }
    from '@angular/common/http/testing';
import { provideHttpClient } from "@angular/common/http";

describe('HeroService', () => {
    let mockMessageService;
    let httpTestingController: HttpTestingController;
    let service: HeroService;

    beforeEach(() => {
        mockMessageService = jasmine.createSpyObj(['add']);
        TestBed.configureTestingModule({
            providers: [HeroService,
                { provide: MessageService, useValue: mockMessageService },
                provideHttpClient(),
                provideHttpClientTesting()
            ]
        });

        httpTestingController = TestBed.inject(HttpTestingController);
        service = TestBed.inject(HeroService);
    });

    describe('getHero', () => {
        it('should call get with the correct URL', () => {
            // call getHero()
            service.getHero(4).subscribe(hero => {
                expect(hero.id).toBe(4); // to get rid of the NO EXPECTATIONS
            }); // getHero returns an Observable and we have to subscribe to it

            // What if there is a bug where we call the getHero twice?
            //service.getHero(4).subscribe(); 

            // What if parameter is different? Test is passing:
            //service.getHero(3).subscribe(); 

            // test that the URL was correct
            const req = httpTestingController.expectOne('api/heroes/4'); //expect get request is going to happen

            // What data we should send back if the call is made
            req.flush({ id: 4, name: 'SuperDude', strength: 100 });
            expect(req.request.method).toBe('GET'); // Check if method is GET

            // Other requests make the test fail now!
            httpTestingController.verify();
        });
    });
});