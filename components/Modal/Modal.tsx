import React, { useRef } from "react";
import { FcPlus } from "react-icons/fc";
import { GrFormClose } from "react-icons/gr";
import ModalLayout from "./ModalLayout";

interface User {
  id?: string;
  name: string;
  email: string;
  phone: string;
  image: string;
}

const Modal = ({
  openModal,
  setOpenModal,
  formData,
  onSave,
  onChange,
  imgPreview,
  imagePreview,
}: {
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
  formData: User;
  onSave: (event: React.FormEvent) => void;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imagePreview: (event: React.ChangeEvent<HTMLInputElement>) => void;
  imgPreview: string;
}) => {
  const imageRef = useRef(null);
  return (
    <ModalLayout openModal={openModal} setOpenModal={setOpenModal}>
      <GrFormClose
        size={25}
        className="absolute top-4 right-5 cursor-pointer"
        onClick={() => setOpenModal(false)}
      />
      <form onSubmit={onSave} className="pt-10">
        <div className="flex flex-col">
          <label className="text-sm text-[#1B2F3F] pb-2 font-poppins font-medium">
            Name
          </label>
          <input
            type="text"
            value={formData.name}
            name="name"
            onChange={onChange}
            className="border-b outline-none py-1 text-sm font-poppins font-medium"
          />
        </div>
        <div className="relative w-fit mt-6">
          <img
            src={imgPreview ? imgPreview : "/assets/profile-blank.png"}
            alt=""
            className="w-20 h-20 object-cover"
          />
          <input
            type="file"
            name="image"
            accept="image/*"
            hidden
            ref={imageRef}
            onChange={(event) => {
              onChange(event);
              imagePreview(event);
            }}
          />
          <div
            className="cursor-pointer absolute -bottom-1 -right-2 p-1 bg-white shadow-md rounded-full overflow-hidden"
            onClick={() => imageRef.current?.click()}
          >
            <FcPlus size={15} />
          </div>
        </div>
        <div className="flex flex-col mt-6">
          <label className="text-sm text-[#1B2F3F] pb-2 font-poppins font-medium">
            Phone
          </label>
          <input
            type="text"
            name="phone"
            value={formData.phone ? formData.phone : ""}
            onChange={onChange}
            className="border-b outline-none py-1 text-sm font-poppins font-medium"
          />
        </div>
        <div className="flex flex-col mt-6">
          <label className="text-sm text-[#1B2F3F] pb-2 font-poppins font-medium">
            Email
          </label>
          <input
            type="text"
            name="email"
            value={formData.email}
            onChange={onChange}
            className="border-b outline-none py-1 text-sm font-poppins font-medium"
          />
        </div>
        <button
          type="submit"
          className="bg-[#1B2F3F] text-white text-sm font-poppins px-3 py-1 my-5 float-right hover:bg-[#254763] transition-all duration-300"
        >
          Save
        </button>
      </form>
    </ModalLayout>
  );
};

export default Modal;
