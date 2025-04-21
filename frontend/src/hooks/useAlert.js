import Swal from 'sweetalert2';

export default function useAlert() {
  return {
    outOfStock: () =>
      Swal.fire({
        icon: 'warning',
        title: 'Out of Stock!',
        text: 'You cannot add more items than the available inventory.',
      }),
    addedToCart: () =>
      Swal.fire({
        icon: 'success',
        title: 'Added to Cart',
        timer: 1000,
        showConfirmButton: false,
      }),
    generalError: (msg = 'Something went wrong') =>
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: msg,
      }),
  };
}
