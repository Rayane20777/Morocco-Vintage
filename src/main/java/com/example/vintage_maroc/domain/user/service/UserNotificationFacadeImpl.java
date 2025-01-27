package com.example.vintage_maroc.domain.user.service;

import com.example.vintage_maroc.domain.user.repository.UserRepository;
import com.example.vintage_maroc.infrastructure.facade.UserNotificationFacade;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

@Slf4j
@Service
@RequiredArgsConstructor
public class UserNotificationFacadeImpl implements UserNotificationFacade {

    private final UserRepository userRepository;

    @Override
    public void notifyAdminsOfNewAlbum(String albumId, String title, String artist) {
        userRepository.findByRoles_NameEquals("ROLE_ADMIN").forEach(admin ->
            log.info("Notifying admin {} about new album: {} by {}", admin.getLogin(), title, artist)
        );
    }

    @Override
    public void notifyUsersOfNewSong(String songId, String title, String albumId) {
        userRepository.findAll().forEach(user ->
            log.info("Notifying user {} about new song: {} in album {}", user.getLogin(), title, albumId)
        );
    }
}

