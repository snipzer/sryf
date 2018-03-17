
export default class UserDto {

    constructor(username, userMail, userPassword, scenarios, imagesContainer, soundsContainer, textsContainer) {
        this.userName = username;
        this.userMail = userMail;
        this.userPassword = userPassword;
        this.scenarios = scenarios;
        this.imagesContainer = imagesContainer;
        this.soundsContainer = soundsContainer;
        this.textsContainer = textsContainer;
    }

}