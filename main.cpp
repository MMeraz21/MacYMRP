#include "discord_game_sdk/cpp/discord.h"
#include <iostream>

const int64_t appID = 1182067397805486120;
// std::unique_ptr<discord::Core> core;

bool createPresence(void){
    // discord::Core* temp = nullptr;
    // discord::Result result = discord::Core::Create(appID,DiscordCreateFlags_NoRequireDiscord, &temp);
    // core.reset(temp);
    // return result == discord::Result::Ok;
    return true;
}

int main(void){
    std::cout << "haiii :3" << std::endl;
    while(true){
        createPresence();
    }
    return 0;
}