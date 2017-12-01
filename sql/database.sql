SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

CREATE DATABASE `myplaylist` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci;
USE `myplaylist`;

CREATE TABLE IF NOT EXISTS `users` (
    `id` smallint(5) NOT NULL AUTO_INCREMENT,
    `username` varchar(20) NOT NULL,
    `password` varchar(20) NOT NULL,
    `email` varchar(30) NOT NULL,
    `createdAt` timestamp,
    `updatedAt` timestamp,
    `status` smallint(1) NOT NULL,
    PRIMARY KEY(`id`),
    KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `playlists` (
    `id` smallint(5) NOT NULL AUTO_INCREMENT,
    `userId` smallint(5) NOT NULL,
    `name` varchar(30) NOT NULL,
    `createdAt` timestamp,
    `updatedAt` timestamp,
    `status` smallint(1) NOT NULL,
    PRIMARY KEY(`id`),
    KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

CREATE TABLE IF NOT EXISTS `videos` (
    `id` smallint(5) NOT NULL AUTO_INCREMENT,
    `playlistId` smallint(5) NOT NULL,
    `title` varchar(30) NOT NULL,
    `link` TEXT NOT NULL,
    `createdAt` timestamp,
    `updatedAt` timestamp,
    `status` smallint(1) NOT NULL,
    PRIMARY KEY(`id`),
    KEY `id` (`id`)
) ENGINE=MyISAM DEFAULT CHARSET=utf8 AUTO_INCREMENT=1 ;

/*CREATE TABLE IF NOT EXISTS `map_videos` (
    `videoId` smallint(5) NOT NULL,
    `playlistId` smallint(5) NOT NULL,
    `createdAt` timestamp,
    `updatedAt` timestamp,
    `status` smallint(1) NOT NULL
) ENGINE=MyISAM DEFAULT CHARSET=utf8;*/


