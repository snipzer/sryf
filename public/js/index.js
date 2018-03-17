$(document).ready(function ()
{
    var token = getToken();
    var myTimeout;

    if (!token)
    {
        $('#register-card').hide();
        $("#entreprise").hide();
        $("#login").show();
    }
    else
    {
        listCampaigns();
        handleDisconnect();
        handleUnsubscribe(token);
    }
    
    $(".button-collapse").sideNav();
    handleLogin();
    showLogin();
    handleRegister();
    
    // Gère le submit pour le login
    function handleLogin() {
        $("#submit").unbind('click').bind('click', function (e)
        {
            e.preventDefault();
            $.ajax({
                url: '/api/v1/login',
                type: 'POST',
                data: {email: $("#email").val(), password: $("#password").val()},
                dataType: 'json',
                success: function (data, status)
                {
                    if(data.errMessage) {
                        displayError(data.errMessage)
                    } else {
                        localStorage.setItem("api_token", data.token);
                        localStorage.setItem("entreprise_id", data.id);
                        handleDisconnect();
                        handleUnsubscribe(data.token);
                        listCampaigns();
                    }
                },
                error: function (result, status, error)
                {
                    displayError("Identifiant ou mot de passe invalide")
                }
            });
        });
    }

    function listCampaigns()
    {
        document.title = 'Gestion des campagnes';
        var token = getToken();
        if (!token)
        {
            $('#register-card').hide();
            $("#entreprise").hide();
            $("#login").show();
            // Gère la page register
            handleRegister(token);
        }
        else
        {
            $.ajax({
                url: '/api/v1/entreprises/' + localStorage.getItem('entreprise_id'),
                type: 'GET',
                headers: {"Authorization": token},
                dataType: 'json',
                success: function(json, status)
                {
                    $('.display_name_enterprise').text(`Bienvenue ${json.label}`);
                    $('#ad_url').text(json.url_ad);
                    var img = `<img src="${json.url_picture}" width="150px">`
                    $('#img_url').html(img);


                    var campaigns = json.campaigns;
                    $.ajax({
                        url: '/getCampaigns',
                        type: 'GET',
                        headers: {"Authorization": token},
                        dataType: 'json',
                        success: function (json, status) {
                            let str = `<p> `;
                            for(var j = 0; j < json.data.length; j++)
                            {
                                str += `<input type="checkbox" class="checkCampaign"`;
                                for (var id in campaigns) {
                                    if (campaigns[id] == json.data[j].id)
                                        str += ` checked="checked" `
                                }
                                str += `id = ${json.data[j].id} />`
                                str += `<label for = ${json.data[j].id}>${json.data[j].sujet}</label>`
                                str += ` </p>`;
                            }
                            $("#campaigns").html(str);
                            // Ajoute ou enlève la campagne à l'entreprise lors du click sur la checkbox
                            $('.checkCampaign').unbind('change').bind('change', function ()
                            {
                                // On récupère d'abord l'entreprise qui est connectée
                                var that = this;
                                $.ajax({
                                    url: '/api/v1/entreprises/' + localStorage.getItem('entreprise_id'),
                                    type: 'GET',
                                    headers: {"Authorization": token},
                                    dataType: 'json',
                                    success: function (json, status)
                                    {
                                        if(json.errMessage) {
                                            displayError(json.errMessage)
                                        } else {
                                            var urlMethod = "";
                                            if (that.checked) // Si la checkbox est maintenant cochée, on ajoute la campagne
                                                urlMethod = '/api/v1/entreprises/' + localStorage.getItem('entreprise_id') + '/' + that.getAttribute('id') + '/add';
                                            else // Sinon on supprime
                                                urlMethod = '/api/v1/entreprises/' + localStorage.getItem('entreprise_id') + '/' + that.getAttribute('id') + '/remove';

                                            $.ajax({
                                                url: urlMethod,
                                                type: 'PUT',
                                                headers: {"Authorization": token},
                                                success: function (json, status) {
                                                    if (json.errMessage) {
                                                        displayError(json.errMessage)
                                                    } else {
                                                        displaySuccess("modification validée")
                                                    }
                                                },
                                                error: function (result, status, error) {
                                                    that.checked = !that.checked;
                                                    displayError(error.message)
                                                }
                                            });
                                        }
                                    },
                                    error: function (error)
                                    {
                                        displayError(error.message)
                                    }
                                });
                            });
                        },
                        error: function (error) {
                             displayError(error.message)
                        }
                    });
                }
            });
            $('#register-card').hide();
            $("#entreprise").show();
            $("#login").hide();
        }
    }


    // Récupère un token
    function getToken()
    {
        var token = localStorage.getItem('api_token');

        if (token == null || typeof token == "undefined")
        {
            return false
        }
        return token;
    }

    // Gère l'affichage et la création d'entreprise
    function handleRegister() {
        $('#show-register').unbind('click').bind('click', function (e)
        {
            document.title = 'Inscription';
            e.preventDefault();
            $('#login').hide();
            $('#register-card').show();
            bindSubmitForRegister();
        });
    }

    // Gère l'affichage et la création d'entreprise
    function showLogin() {
        $('#show-login').unbind('click').bind('click', function (e)
        {
            document.title = 'Connexion';
            e.preventDefault();
            $('#login').show();
            $('#register-card').hide();
        });
    }

    // Gère le process de création d'entreprise
    function bindSubmitForRegister()
    {
        $("#submit-register").unbind('click').bind('click', function (e)
        {
            e.preventDefault();
            var formData = [];
            formData['label'] = $('#label').val();
            formData['email'] = $('#emailRegister').val();
            formData['password'] = $('#passwordRegister').val();
            formData['passwordConfirm'] = $('#passwordConfirmRegister').val();
            formData['url_ad'] = $('#url-ad').val();
            formData['url_picture'] = $('#url-picture').val();

            var empty = false;
            for(var i in formData) {
                if (formData[i] == "") empty = true
            }

            if (!empty && formData['password'] === formData['passwordConfirm'])
            {
                $.ajax({
                    url: "/api/v1/entreprises",
                    headers: {"Authorization": token},
                    method: "POST",
                    data: {
                        label: formData['label'],
                        email: formData['email'],
                        password: formData['password'],
                        url_ad: formData['url_ad'],
                        url_picture: formData['url_picture']
                    },
                    success: function (data)
                    {
                        if(data.errMessage) {
                            displayError(data.errMessage)
                        } else {
                            $('#register-card').hide();
                            $('#login').show();
                        }
                    },
                    error: function (error)
                    {
                        let e;
                        if (error.responseJSON.errmsg.match("duplicate")) {
                            e = "L'adresse email est invalide"
                        } else {
                            e = "Une erreur est survenue, si le probleme persiste, c'ets bien dommage..."
                        }
                        displayError(e);
                    }
                })
            }
            else
            {
                if(empty) {
                    displayError("Merci de remplir tous les champs");
                }
                else if(formData['password'] != formData['passwordConfirm']) {
                    displayError("Les mots de passe ne correspondent pas");
                }
            }
        });
    }

    function handleDisconnect() {
        $(".but_disconnect").unbind('click').bind('click', function (e) {
            e.preventDefault();
            document.title = 'Connexion';
            localStorage.removeItem('api_token');
            $("#login").show();
            $('#register-card').hide();
            $("#entreprise").hide();
        });
    }

    function handleUnsubscribe(token) {
        $(".but_unsubscribe").unbind('click').bind('click', function (e) {
            document.title = 'Connexion';
            e.preventDefault();
            var c = confirm("Êtes vous sûr de vouloir vous désinscrire ?");
            if (c) {
                var id = localStorage.getItem('entreprise_id');
                $.ajax({
                    url: "/api/v1/entreprises/" + id,
                    headers: {"Authorization": token},
                    method: "DELETE",
                    success: function (data)
                    {
                        if(data.errMessage) {
                            displayError(data.errMessage)
                        } else {
                            localStorage.removeItem('api_token');
                            $("#login").show();
                            $('#register-card').hide();
                            $("#entreprise").hide();
                        }
                    },
                    error: function (error)
                    {
                        displayError(error.message);
                    }
                })
            }

        });
    }

    function displayError(msg) {
        window.scrollTo(0, 0);
        clearTimeout(myTimeout);
        $("#error_msg").text(msg);
        myTimeout = setTimeout(function(){
            $("#error_msg").text("")
        }, 3000);
    }

    function displaySuccess(msg) {
        window.scrollTo(0, 0);
        clearTimeout(myTimeout);
        $("#success_msg").text(msg);
        myTimeout = setTimeout(function(){
            $("#success_msg").text("")
        }, 3000);
    }

});
