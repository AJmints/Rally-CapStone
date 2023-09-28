package org.rally.backend.springsecurity.security;

public class SecurityConstants {

    /** Security constants for decoding and verifiying JWT tokens **/
    /** These are here as an example. In a real project, we would use a .env file **/
    public static final long JWT_EXPIRATION = 21600000; // 6 hours = 21600000milliseconds
    public static final String JWT_SECRET = "LoremIpsumDolorSitAmetConsecteturAdipiscingElit";
}
