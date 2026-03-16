import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaStar, FaHeart, FaRegHeart } from 'react-icons/fa';
import type { Listing } from '../types';

interface ListingCardProps {
  listing: Listing;
}

const ListingCard = ({ listing }: ListingCardProps) => {
  const navigate = useNavigate();
  const [isFavorite, setIsFavorite] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const handleCardClick = () => {
    navigate(`/listing/${listing._id}`);
  };

  const handleFavoriteClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsFavorite(!isFavorite);
  };

  const handlePrevImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === 0 ? listing.images.length - 1 : prev - 1
    );
  };

  const handleNextImage = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImageIndex((prev) =>
      prev === listing.images.length - 1 ? 0 : prev + 1
    );
  };

  return (
    <div
      className="cursor-pointer group transition duration-300 hover:-translate-y-1 hover:shadow-lg"
      onClick={handleCardClick}
    >
      {/* Image Container */}
      <div className="relative aspect-square rounded-xl overflow-hidden mb-3">
        <img
          src={listing.images[currentImageIndex]}
          alt={listing.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          onError={(e) => {
            e.currentTarget.src =
              'https://via.placeholder.com/400x400?text=No+Image';
          }}
        />

        {/* Favorite Button */}
        <button
          onClick={handleFavoriteClick}
          className="absolute top-3 right-3 bg-white/80 backdrop-blur rounded-full p-2 hover:scale-110 transition"
        >
          {isFavorite ? (
            <FaHeart className="text-airbnb-red text-lg" />
          ) : (
            <FaRegHeart className="text-gray-700 text-lg" />
          )}
        </button>

        {/* Image Navigation */}
        {listing.images.length > 1 && (
          <>
            <button
              onClick={handlePrevImage}
              className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition"
            >
              <span className="text-sm">‹</span>
            </button>

            <button
              onClick={handleNextImage}
              className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow opacity-0 group-hover:opacity-100 transition"
            >
              <span className="text-sm">›</span>
            </button>

            {/* Image Dots */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex space-x-1">
              {listing.images.map((_, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full transition ${
                    index === currentImageIndex
                      ? 'bg-white'
                      : 'bg-white/50'
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Listing Info */}
      <div className="space-y-1 px-1">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold text-gray-900 truncate">
            {listing.location.city}, {listing.location.state}
          </h3>

          {listing.rating && (
            <div className="flex items-center gap-1 text-sm">
              <FaStar className="text-black text-xs" />
              <span className="font-medium">
                {listing.rating.toFixed(1)}
              </span>
            </div>
          )}
        </div>

        <p className="text-sm text-airbnb-gray truncate">
          {listing.propertyType} · {listing.bedrooms} bedroom
          {listing.bedrooms > 1 ? 's' : ''}
        </p>

        <p className="text-sm text-airbnb-gray">
          {listing.maxGuests} guest{listing.maxGuests > 1 ? 's' : ''} ·{' '}
          {listing.bathrooms} bath{listing.bathrooms > 1 ? 's' : ''}
        </p>

        <div className="pt-1">
          <span className="font-semibold text-gray-900 text-base">
            ${listing.price}
          </span>
          <span className="text-sm text-airbnb-gray"> / night</span>
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
