--
-- PostgreSQL database dump
--

\restrict xJW97M1D7gGEPsRghZXrqqDL41XO4233IlvjujovPymrELVgjkd6zba7YFS5iAn

-- Dumped from database version 17.6 (Postgres.app)
-- Dumped by pg_dump version 17.6 (Postgres.app)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: products; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.products (id, name, description, price, image, created_at) FROM stdin;
1	Defending Throw-in: Own Half 1	Fundamental setup and positioning for defending an opposition throw-in deep in your defensive half. Focuses on minimizing space and preventing switches of play.	0.99	/products//storage/defending_throwin_ownhalf_01.jpg	2025-10-14 13:49:11.252909
2	Defending Throw-in: Opponent's Half 1	Tactical scheme for defending throw-ins in the opponent's half. High-press technique to immediately recover the ball and launch a counter-attack.	0.99	/products//storage/defending_throwin_opponenthalf_01.jpg	2025-10-14 13:49:11.256453
3	Defending Free-kick 1	The basic zonal marking structure for defending indirect free-kicks outside the penalty box. Covers wall positioning and player roles for quick clearance.	0.99	/products//storage/defending_freekick_01.jpg	2025-10-14 13:49:11.258874
4	Defending In-swinging Corner 1	Specific defensive organization against an in-swinging (inswing) corner kick, detailing the goalkeeper's command zone and the required angles for headers.	0.99	/products//storage/defending_inswing_corner_01.jpg	2025-10-14 13:49:11.259503
5	Defending Short Corner 2: 1-Man Setup	Advanced tactical setup using a single player to press the short corner, forcing isolation and frustrating the opponent's attacking routine.	0.99	/products//storage/defending_shortcorner_02.jpg	2025-10-14 13:49:11.260031
6	Attacking Throw-in: Own Half / Middle Third 1	Offensive routine for retaining possession and progressing play quickly through the mid-third using a short, controlled throw-in sequence.	0.99	/products//storage/attacking_throwin_middle_01.jpg	2025-10-14 13:49:11.260662
7	Attacking Throw-in: Final Third / Attacking Third 1	High-risk, high-reward attacking play from a throw-in near the box (Final Third), designed to create immediate crossing or shooting opportunities.	0.99	/products//storage/attacking_throwin_final_01.jpg	2025-10-14 13:49:11.26132
8	Attacking Free Kick 1	A classic indirect free-kick routine designed to draw defenders and open space for a targeted shot on goal from outside the box.	1.29	/products//storage/attacking_freekick_01.jpg	2025-10-14 13:49:11.261801
9	Attacking Corner 1	A standard attacking corner kick routine focusing on pre-determined runs and blocking movements to create space for a powerful header at the near post.	1.29	/products//storage/attacking_corner_01.jpg	2025-10-14 13:49:11.262653
\.


--
-- Name: products_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.products_id_seq', 9, true);


--
-- PostgreSQL database dump complete
--

\unrestrict xJW97M1D7gGEPsRghZXrqqDL41XO4233IlvjujovPymrELVgjkd6zba7YFS5iAn

