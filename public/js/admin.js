const deleteProduct = (btn) => {
    const prodId = btn.parentNode.querySelector('[name=productId]').value;
    const csrf = btn.parentNode.querySelector('[name=_csrf]').value;

    const prodElement = btn.closest('article');
    
    fetch('/admin/delete-product/' + prodId, {
        method: 'DELETE',
        headers: {
            'csrf-token': csrf
        }
    }).then(result => {
        return result.json;
    }).then(data=> {
        console.log(data);
        cardElelment.parentNode.removeChild(prodElement);
    })
    .catch(err => console.log(err));

}
