import {$, $$} from './_helpers';

function updateName () {
    $('#name_field').addEventListener('keyup', function () {
        let value = this.value;
        if (!value) {
            value = 'Dawg';
        }
        $('#name').textContent = value;
    });
}

document.addEventListener('DOMContentLoaded', function () {
    const links = $$('a');

    updateName();

    links.forEach(link => link.setAttribute('data-yo', 'dawg'));
});

// for test coverage
export { updateName };