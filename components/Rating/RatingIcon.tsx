import React, { useMemo, useState } from "react";
import { AiFillStar, AiOutlineStar } from "react-icons/ai";

const RatingIcon = ({
  count,
  rating,
  size,
  onRating,
  hoverRating,
  setHoverRating,
}: {
  count: number;
  rating?: number;
  size?: number;
  onRating?: (rate: number) => void;
  hoverRating?: number;
  setHoverRating?: React.Dispatch<React.SetStateAction<number>>;
}) => {
  // const [hoverRating, setHoverRating] = useState(0);

  const starRating = useMemo(() => {
    return Array(count)
      .fill(0)
      .map((_, i) => i + 1)
      .map((idx) => {
        if (hoverRating >= idx) {
          return (
            <AiFillStar
              key={idx}
              size={size}
              className="text-yellow-500 cursor-pointer"
              onClick={() => onRating(idx)}
              onMouseEnter={() => setHoverRating(idx)}
              onMouseLeave={() => setHoverRating(0)}
            />
          );
        } else if (!hoverRating && rating >= idx) {
          return (
            <AiFillStar
              key={idx}
              size={size}
              className="text-yellow-500 cursor-pointer"
              onClick={() => onRating(idx)}
              onMouseEnter={() => setHoverRating(idx)}
              onMouseLeave={() => setHoverRating(0)}
            />
          );
        } else {
          return (
            <AiOutlineStar
              key={idx}
              size={size}
              className="text-yellow-500 cursor-pointer"
              onClick={() => onRating(idx)}
              onMouseEnter={() => setHoverRating(idx)}
              onMouseLeave={() => setHoverRating(0)}
            />
          );
        }
      });
  }, [count, rating, hoverRating]);

  return <div className="flex">{starRating}</div>;
};

export default RatingIcon;
