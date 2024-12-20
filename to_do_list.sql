-- phpMyAdmin SQL Dump
-- version 5.2.0
-- https://www.phpmyadmin.net/
--
-- 主機： 127.0.0.1
-- 產生時間： 2024-11-23 07:40:18
-- 伺服器版本： 10.4.24-MariaDB
-- PHP 版本： 8.1.6

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- 資料庫： `to_do_list`
--

-- --------------------------------------------------------

--
-- 資料表結構 `to_do_list`
--

CREATE TABLE `to_do_list` (
  `t_d_id` int(11) NOT NULL,
  `item` varchar(255) NOT NULL,
  `create_date` date DEFAULT current_timestamp(),
  `user_id` int(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

--
-- 傾印資料表的資料 `to_do_list`
--

INSERT INTO `to_do_list` (`t_d_id`, `item`, `create_date`, `user_id`) VALUES
(2, 'a', '2024-10-31', 1),
(3, 'aaa', '2024-11-26', 1),
(4, 'aaaa', '2024-11-13', 1),
(6, 'test3', '2024-10-31', 7),
(7, 'test3', '2024-11-11', 7);

-- --------------------------------------------------------

--
-- 資料表結構 `user_account`
--

CREATE TABLE `user_account` (
  `user_id` int(11) NOT NULL,
  `account` varchar(255) NOT NULL,
  `password` varchar(255) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;


CREATE TABLE image_uploads (
  id INT AUTO_INCREMENT PRIMARY KEY,
  image_path VARCHAR(255) NOT NULL,
  user_id INT NOT NULL,
  upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (user_id) REFERENCES users(id)
);

--
-- 傾印資料表的資料 `user_account`
--

INSERT INTO `user_account` (`user_id`, `account`, `password`) VALUES
(1, 'test', 'test'),
(6, 'test1', 'test1'),
(7, 'test3', 'test3');

--
-- 已傾印資料表的索引
--

--
-- 資料表索引 `to_do_list`
--
ALTER TABLE `to_do_list`
  ADD PRIMARY KEY (`t_d_id`);

--
-- 資料表索引 `user_account`
--
ALTER TABLE `user_account`
  ADD PRIMARY KEY (`user_id`);

--
-- 在傾印的資料表使用自動遞增(AUTO_INCREMENT)
--

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `to_do_list`
--
ALTER TABLE `to_do_list`
  MODIFY `t_d_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- 使用資料表自動遞增(AUTO_INCREMENT) `user_account`
--
ALTER TABLE `user_account`
  MODIFY `user_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
