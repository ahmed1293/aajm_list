

def test_redirect_if_not_logged_in(client):
    client.logout()
    response = client.get('/')

    assert response.status_code == 302
    assert response.url == '/login?next=/'


def test_redirect_after_logging_out(client):
    response = client.get('/logout', follow=True)
    assert response.status_code == 200
    assert response.redirect_chain[-1] == ('/login/', 301)


def test_superuser_can_login_into_admin(admin_client):
    response = admin_client.get('/admin/')
    assert response.status_code == 200


def test_non_registered_user_cant_login(client):
    client.logout()
    user_logged_in = client.login(username='not_registered', password='ejhrjqkwh12')
    assert not user_logged_in

    admin_response = client.get('/admin/')
    assert admin_response.status_code == 302
    assert admin_response.url == '/admin/login/?next=/admin/'

    homepage_response = client.get('/')
    assert homepage_response.status_code == 302
    assert homepage_response.url == '/login?next=/'
