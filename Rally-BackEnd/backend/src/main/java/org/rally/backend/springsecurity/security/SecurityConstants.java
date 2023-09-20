package org.rally.backend.springsecurity.security;

public class SecurityConstants {

    /** Security constants for decoding and verifiying JWT tokens **/
    /** These are here for this project to run, but need to use a different approach with real project **/
    public static final long JWT_EXPIRATION = 21600000; // 6 hours = 21600000milliseconds
    public static final String JWT_SECRET = "LoremIpsumDolorSitAmetConsecteturAdipiscingElit";
}
