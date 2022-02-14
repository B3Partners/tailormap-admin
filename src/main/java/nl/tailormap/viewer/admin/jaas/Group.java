package nl.tailormap.viewer.admin.jaas;

import java.security.Principal;

public class Group implements Principal {

    private final String name;

    public Group(String name) {
        this.name = name;
    }

    @Override
    public String getName() {
        return name;
    }

    @Override
    public String toString() {
        return name;
    }
}
