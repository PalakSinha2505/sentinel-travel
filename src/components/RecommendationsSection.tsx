import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Star, Clock, Camera } from 'lucide-react';

const recommendations = {
  attractions: [
    {
      id: 1,
      name: 'Notre-Dame Cathedral',
      description: 'Gothic architectural masterpiece in the heart of Paris',
      rating: 4.6,
      estimatedTime: '2-3 hours',
      distance: '1.2 km',
      category: 'Historical'
    },
    {
      id: 2,
      name: 'Seine River Cruise',
      description: 'Scenic boat tour along the Seine with city views',
      rating: 4.4,
      estimatedTime: '1 hour',
      distance: '0.8 km',
      category: 'Sightseeing'
    }
  ],
  restaurants: [
    {
      id: 1,
      name: 'Le Comptoir du Relais',
      description: 'Traditional French bistro with authentic cuisine',
      rating: 4.5,
      priceRange: '€€€',
      cuisine: 'French',
      distance: '0.5 km'
    },
    {
      id: 2,
      name: 'Breizh Café',
      description: 'Modern crêperie with creative sweet and savory options',
      rating: 4.3,
      priceRange: '€€',
      cuisine: 'Crêpes',
      distance: '0.7 km'
    }
  ],
  events: [
    {
      id: 1,
      name: 'Louvre Night Tours',
      description: 'Special evening access to the museum with guided tours',
      date: 'Today, 7:00 PM',
      price: '€25',
      availability: 'Limited spots'
    },
    {
      id: 2,
      name: 'Montmartre Art Walk',
      description: 'Walking tour through historic artist district',
      date: 'Tomorrow, 2:00 PM',
      price: '€15',
      availability: 'Available'
    }
  ]
};

export const RecommendationsSection = () => {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold">Recommendations for You</h3>

      {/* Popular Attractions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Camera className="w-5 h-5" />
            Popular Attractions
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.attractions.map((attraction) => (
            <div key={attraction.id} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{attraction.name}</h4>
                  <Badge variant="outline">{attraction.category}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{attraction.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{attraction.rating}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{attraction.estimatedTime}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{attraction.distance}</span>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline">
                Get Directions
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Food Spots */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-warning" />
            Food Spots
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.restaurants.map((restaurant) => (
            <div key={restaurant.id} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <h4 className="font-medium">{restaurant.name}</h4>
                  <Badge variant="outline">{restaurant.cuisine}</Badge>
                </div>
                <p className="text-sm text-muted-foreground mb-2">{restaurant.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                    <span>{restaurant.rating}</span>
                  </div>
                  <span>{restaurant.priceRange}</span>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    <span>{restaurant.distance}</span>
                  </div>
                </div>
              </div>
              <Button size="sm" variant="outline">
                View Menu
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Events */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-accent" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {recommendations.events.map((event) => (
            <div key={event.id} className="flex items-start justify-between p-4 border rounded-lg">
              <div className="flex-1">
                <h4 className="font-medium mb-2">{event.name}</h4>
                <p className="text-sm text-muted-foreground mb-2">{event.description}</p>
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3 h-3" />
                    <span>{event.date}</span>
                  </div>
                  <span>{event.price}</span>
                  <Badge 
                    variant="outline" 
                    className={event.availability === 'Limited spots' ? 'text-warning border-warning' : 'text-success border-success'}
                  >
                    {event.availability}
                  </Badge>
                </div>
              </div>
              <Button size="sm">
                Book Now
              </Button>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
};