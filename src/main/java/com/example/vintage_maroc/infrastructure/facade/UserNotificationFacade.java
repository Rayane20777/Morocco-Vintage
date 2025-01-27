package com.example.vintage_maroc.infrastructure.facade;

public interface UserNotificationFacade {
    void notifyAdminsOfNewAlbum(String albumId, String title, String artist);
    void notifyUsersOfNewSong(String songId, String title, String albumId);
}

