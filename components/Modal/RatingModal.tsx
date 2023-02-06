import React, { useState } from "react";
import axiosClient from "../../config/axiosClient";
import RatingIcon from "../Rating/RatingIcon";
import ModalLayout from "./ModalLayout";

const RatingModal = ({
  openModal,
  setOpenModal,
  userId,
  productId,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  userId: string;
  productId: number;
}) => {
  const [hoverRating, setHoverRating] = useState(0);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const onSave = async () => {
    const data = {
      review: comment,
      productsId: productId,
      rating,
      userId,
    };

    try {
      await axiosClient.post("products/rating/product-rating", data);

      setOpenModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <ModalLayout openModal={openModal} setOpenModal={setOpenModal}>
      <div className="py-3">
        <h1>Rate Product</h1>
        <div className="mt-4">
          <textarea
            name=""
            id=""
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            rows={5}
            className="w-full ring-1 ring-gray-200 px-2 py-2 outline-none text-sm font-poppins font-normal"
            placeholder="What's your product experience after using it."
          />
          <div className="pt-3">
            <RatingIcon
              size={20}
              count={5}
              rating={rating}
              onRating={(rate) => setRating(rate)}
              hoverRating={hoverRating}
              setHoverRating={setHoverRating}
            />
          </div>
        </div>
        <button
          onClick={onSave}
          className="bg-[#1B2F3F] text-white text-sm font-poppins px-4 py-2 my-5 float-right hover:bg-[#254763] transition-all duration-300"
        >
          Save
        </button>
      </div>
    </ModalLayout>
  );
};

export default RatingModal;
