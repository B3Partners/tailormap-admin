/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */
package nl.tailormap.viewer.admin.stripes;

import nl.tailormap.viewer.config.services.AttributeDescriptor;
import nl.tailormap.viewer.config.services.FeatureSource;
import nl.tailormap.viewer.config.services.SimpleFeatureType;
import nl.tailormap.viewer.util.TestUtil;
import org.junit.jupiter.api.Disabled;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertNotNull;

/**
 * @author Meine Toonen
 */
public class AttributeSourceActionBeanTest extends TestUtil {

    private final AttributeSourceActionBean instance = new AttributeSourceActionBean();

    @Test
    @Disabled("This test is disabled since removing the Solr dependency")
    public void testDeleteAttributeSource() {
        FeatureSource fs = entityManager.find(FeatureSource.class, 1L);
        assertNotNull(fs);
        List<FeatureSource> sources = entityManager.createQuery("FROM FeatureSource", FeatureSource.class).getResultList();
        int numSources = sources.size();
        int numAttributesFromSource = 0;
        List<SimpleFeatureType> types = fs.getFeatureTypes();
        for (SimpleFeatureType type : types) {
            numAttributesFromSource += type.getAttributes().size();
        }

        List<AttributeDescriptor> attributes = entityManager.createQuery("FROM AttributeDescriptor", AttributeDescriptor.class).getResultList();
        int totalAttributes = attributes.size();

        instance.setFeatureSource(fs);

        instance.deleteFeatureSource(entityManager);
        sources = entityManager.createQuery("FROM FeatureSource", FeatureSource.class).getResultList();
        assertEquals(numSources - 1, sources.size());

        attributes = entityManager.createQuery("FROM AttributeDescriptor", AttributeDescriptor.class).getResultList();
        assertEquals(totalAttributes - numAttributesFromSource, attributes.size());
    }
}
