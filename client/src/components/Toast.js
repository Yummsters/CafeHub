import Swal from 'sweetalert2';

export const Toast = (icon, text, timer) => {
  const defaultTimer = 1000;
  return Swal.mixin({
    toast: true,
    position: 'top',
    showConfirmButton: false,
    timer: timer || defaultTimer,
    timerProgressBar: true,
  }).fire({
    icon: icon,
    title: text
  })
}

export const ToastBtn = (icon, title, text) => {
  return Swal.fire({
    title: title,
    text: text,
    icon: icon,
    showCancelButton: true,
    confirmButtonColor: "#007355",
    cancelButtonColor: "#F59A23",
    confirmButtonText: "확인",
    cancelButtonText: "취소",
  });
}