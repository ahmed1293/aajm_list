import pytest


def test_superuser_can_login(admin_client):
    response = admin_client.get('/admin/')
    assert response.status_code == 200


@pytest.mark.django_db
def test_no_registered_user_cant_login(client):
    user_logged_in = client.login(username='not_registered', password='ejhrjqkwh12')
    assert not user_logged_in

    response = client.get('/admin/')
    assert response.status_code == 302
    assert response.url == '/admin/login/?next=/admin/'
