import React, { useMemo } from "react";
import { AiFillStar } from "react-icons/ai";

const Rated = ({
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
        return (
          <AiFillStar
            key={idx}
            size={size}
            className="text-yellow-500 cursor-pointer"
          />
        );
      });
  }, [count, rating, hoverRating]);

  return <div className="flex">{starRating}</div>;
};

export default Rated;
