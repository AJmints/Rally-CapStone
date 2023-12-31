import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchRestaurantComponent } from './search-restaurant.component';

describe('SearchComponent', () => {
  let component: SearchRestaurantComponent;
  let fixture: ComponentFixture<SearchRestaurantComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SearchRestaurantComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SearchRestaurantComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
