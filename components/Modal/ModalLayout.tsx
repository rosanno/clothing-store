import React from "react";

const ModalLayout = ({
  children,
  openModal,
  setOpenModal,
}: {
  children: React.ReactNode;
  openModal: boolean;
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  return (
    <>
      <div
        className={`fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-6 h-[70] rounded-md overflow-hidden max-h-full bg-white shadow-md w-[450px]  md:w-[600px] max-w-full z-10 ${
          openModal
            ? "transition ease-in-out duration-300 transform opacity-1 scale-100"
            : "transition ease-in-out duration-200 transform opacity-0 scale-0"
        } transition-all duration-500`}
      >
        {children}
      </div>
      <div
        className={`w-full h-full bg-black/20 backdrop-blur-sm absolute top-0 ${
          openModal ? "block" : "hidden"
        } transition-all duration-300 delay-500`}
        onClick={() => setOpenModal(false)}
      />
    </>
  );
};

export default ModalLayout;
