-- phpMyAdmin SQL Dump
-- version 2.10.1
-- http://www.phpmyadmin.net
-- 
-- Host: localhost
-- Generation Time: Jun 15, 2008 at 05:31 PM
-- Server version: 5.0.45
-- PHP Version: 5.2.5

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";

-- 
-- Database: `dojobeer`
-- 

-- --------------------------------------------------------

-- 
-- Table structure for table `beer`
-- 

CREATE TABLE `beer` (
  `from` int(11) NOT NULL,
  `to` int(11) NOT NULL,
  `cnt` int(11) NOT NULL default '1',
  `comment` varchar(255) NOT NULL,
  `date_time` datetime NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `beer`
-- 


-- --------------------------------------------------------

-- 
-- Table structure for table `user`
-- 

CREATE TABLE `user` (
  `username` varchar(100) NOT NULL,
  `passwd` varchar(100) NOT NULL,
  `email` varchar(255) NOT NULL,
  PRIMARY KEY  (`username`),
  UNIQUE KEY `username_2` (`username`),
  KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;

-- 
-- Dumping data for table `user`
-- 

