import Swal from "sweetalert2";

export const showToast = (message, type = "success") => {
  Swal.fire({
    toast: true,
    position: "top-end",
    icon: type,
    title: message,
    showConfirmButton: false,
    timer: 3000,
    timerProgressBar: true,
  });
};

export const showLoading = (title = "Loading...") => {
  Swal.fire({
    title,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
};

export const hideLoading = () => {
  Swal.close();
};

export const showAlert = (title, text, type = "info") => {
  return Swal.fire({
    title,
    text,
    icon: type,
    confirmButtonText: "OK",
  });
};

export const showConfirm = (title, text) => {
  return Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, do it!",
    cancelButtonText: "Cancel",
  });
};
