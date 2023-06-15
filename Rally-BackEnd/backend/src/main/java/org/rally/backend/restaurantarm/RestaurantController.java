package org.rally.backend.restaurantarm;
import org.rally.backend.restaurantarm.data.RestaurantRepository;
import org.rally.backend.restaurantarm.data.ReviewRepository;
import org.rally.backend.restaurantarm.models.Review;
import org.rally.backend.restaurantarm.models.ReviewDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@RestController
@CrossOrigin(origins = "*")
//@RequestMapping(value="/restaurant")
public class RestaurantController {

  @Autowired
  ReviewRepository reviewRepository;
  @Autowired
  RestaurantRepository restaurantRepository;

  @PostMapping("/add")
  public ResponseEntity<?> addRestaurant (@RequestBody Restaurant restaurant) {
    Restaurant newRestaurant = new Restaurant(restaurant.getRestauntName(), restaurant.getAddress(), restaurant.getConactInfo(),
            restaurant.getNeighborhood(), restaurant.getRestaurantType());
    restaurantRepository.save(newRestaurant);
    return new ResponseEntity<>(newRestaurant, HttpStatus.OK);
  }


  @GetMapping("/restaurantReviews/{id}")
  public ResponseEntity<?> getReviews(@PathVariable int id) {

    List<Review> reviewList = new ArrayList<>();
    for(Review review:reviewRepository.findAll()) {
      if(review.getRestaurantId() == id) {
        System.out.println(review.getReview());
        reviewList.add(review);
      }
    }
    return new ResponseEntity<>(reviewList, HttpStatus.OK);
  }

  @PostMapping("/reviews")
  public ResponseEntity<?> addReview (@RequestBody ReviewDTO reviewDTO) {
    Review newReview = new Review(reviewDTO.getName(), reviewDTO.getDescription(), reviewDTO.getRestaurantId());
    reviewRepository.save(newReview);
    return new ResponseEntity<>(HttpStatus.OK);
  }


  @GetMapping("/restaurantList")
  public List<Restaurant> getRestaurantList() {
    if(restaurantRepository.findAll().size() == 0) {
      createRestaurantObjects();
    }

    List<Restaurant> restaurantList = restaurantRepository.findAll();
    return restaurantList;
  }

  @GetMapping("/viewRestaurant/{id}")
  public Optional<Restaurant> viewRestaurant(@PathVariable int id) {
    return restaurantRepository.findById(id);
  }

  public void createRestaurantObjects() {
    Restaurant restaurant1 = new Restaurant("Hi-Point Drive-In", "1033 McCausland Ave, St. Louis, MO 63117", "https://hipointedrivein.com/", "Clayton","American");
    restaurantRepository.save(restaurant1);

    Restaurant restaurant2 = new Restaurant("Mai Lee", "8396 Musick Memorial Dr, Brentwood, MO 63144", "https://www.maileestl.com/", "Clayton", "Asian");
    restaurantRepository.save(restaurant2);

    Restaurant restaurant3 = new Restaurant("Cafe Napoli", "7754 Forsyth Blvd, Clayton, MO 63105", "https://www.napolistl.com", "Clayton", "Italian");
    restaurantRepository.save(restaurant3);

    Restaurant restaurant4 = new Restaurant("Cafe Loredo", "7710 Forsyth Blvd, Clayton, MO 63105",
            "https://www.cantinalaredo.com", "Clayton", "Mexican");
    restaurantRepository.save(restaurant4);

    Restaurant restaurant5 = new Restaurant("MOD Pizza", "8855K Ladue Rd, Ladue, MO 63124",
            "https://www.modpizza.com", "Clayton", "Pizza");
    restaurantRepository.save(restaurant5);

    Restaurant restaurant6 = new Restaurant("City Park Grill", "3157 Morganford Rd, Saint Louis, MO 63116", "https://www.city-park-grill.com", "Tower Grove","American");
    restaurantRepository.save(restaurant6);

    Restaurant restaurant7 = new Restaurant("The King and I Thai Cuisine",
            "3155 South Grand Ave., St.Louis, Mo 63118",
            "https://www.kingandistl.com/", "Tower Grove", "Asian");
    restaurantRepository.save(restaurant7);

    Restaurant restaurant8 = new Restaurant("Guido’s Pizzeria and Tapas",
            "5046 Shaw Ave, St. Louis, MO 63110", "https://www.guidosstl.com", "Tower Grove", "Italian");
    restaurantRepository.save(restaurant8);

    Restaurant restaurant9 = new Restaurant("El Paisano Mexican Restaurant",
            "3315 Watson Rd, St. Louis, MO 63139", "https://www.orderelpaisanomexicanrestaurant.com", "Tower Grove", "Mexican");
    restaurantRepository.save(restaurant9);

    Restaurant restaurant10 = new Restaurant("Blackthorne Pub & Pizza", "3735 Wyoming St, St. Louis, MO 63116",
            "https://www.blackthornstl.com", "Tower Grove", "Pizza");
    restaurantRepository.save(restaurant10);

    Restaurant restaurant11 = new Restaurant("The Blue Duck",
            "2661 Sutton Blvd, Maplewood, MO 63143","https://www.blueduckstl.com", "Maplewood", "American");
    restaurantRepository.save(restaurant11);

    Restaurant restaurant12 = new Restaurant("Yummi Tummi",
            "3001 S Big Bend Blvd, Maplewood, MO 631434", "https://www.yummitummimo.com",
            "Maplewood", "Asian");
    restaurantRepository.save(restaurant12);

    Restaurant restaurant13 = new Restaurant("Acero", "7266 Manchester Rd, Maplewood, MO 63143", "https://www.acero-stl.com", "Maplewood", "Italian");
    restaurantRepository.save(restaurant13);

    Restaurant restaurant14 = new Restaurant("Cowbron Mexican Restaurant",
            "3248 Laclede Station Rd, Maplewood, MO 63143", "https://www.cowbronstl.com", "Maplewood", "Mexican");
    restaurantRepository.save(restaurant14);

    Restaurant restaurant15 = new Restaurant("Failoni’s Restaurant", "6715 Manchester Ave, St. Louis, MO 63139", "https://www.slicelife.com", "Maplewood", "Pizza");
    restaurantRepository.save(restaurant15);

    Restaurant restaurant16 = new Restaurant("Hodak's Restaurant and Bar","2100 Gravois Ave., St. Louis, MO 63104", "https://www.hodaks.com", "Benton Park","American");
    restaurantRepository.save(restaurant16);

    Restaurant restaurant17 = new Restaurant("A-1 WOK RESTAURANT", "1825 Gravois Ave, St. Louis, MO 63104", "https://www.a1wok.wordpress.com","Benton Park","Asian");
    restaurantRepository.save(restaurant17);

    Restaurant restaurant18 = new Restaurant("Gian-Tony's Ristorante", "5356 Daggett Ave #3028, St. Louis, MO 63110", "https://www.giantonys.com", "Benton Park", "Italian");
    restaurantRepository.save(restaurant18);

    Restaurant restaurant19 = new Restaurant("La Vallesana", "2801 Cherokee St, St. Louis, MO 63118", "https://www.neverialavallesana.com", "Benton Park", "Mexican");
    restaurantRepository.save(restaurant19);

    Restaurant restaurant20 = new Restaurant("Pizzeoli Wood Fired Pizza", "1928 S 12th St, St. Louis, MO 63104", "https://www.pizzeoli.com", "Benton Park", "Pizza");
    restaurantRepository.save(restaurant20);


  }
}
