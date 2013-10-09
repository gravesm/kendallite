<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" version="1.0">
    <xsl:output omit-xml-declaration="yes" />

    <xsl:template match="/">
        <xsl:apply-templates />
    </xsl:template>

    <!-- Top level sections -->
    <xsl:template match="metadata/idinfo">
        <h3>Identification Information</h3>
        <xsl:apply-templates />
    </xsl:template>

    <xsl:template match="metadata/metainfo">
        <h3>Metadata Reference Information</h3>
        <xsl:apply-templates />
    </xsl:template>

    <xsl:template match="metadata/eainfo">
        <h3>Entity and Attribute Information</h3>
        <xsl:apply-templates />
    </xsl:template>

    <xsl:template match="metadata/spdoinfo">
        <h3>Spatial Data Organization Information</h3>
        <dl class="dl-horizontal">
            <xsl:apply-templates />
        </dl>
    </xsl:template>

    <!-- Second level sections -->
    <xsl:template match="citation">
        <h4>Citation Information</h4>
        <dl class="dl-horizontal">
            <xsl:apply-templates select="citeinfo" />
        </dl>
    </xsl:template>

    <xsl:template match="descript">
        <h4>Description</h4>
        <dl class="dl-horizontal">
            <xsl:apply-templates />
        </dl>
    </xsl:template>

    <xsl:template match="timeperd">
        <h4>Time Period of Content</h4>
        <dl class="dl-horizontal">
            <xsl:apply-templates />
        </dl>
    </xsl:template>

    <xsl:template match="status">
        <h4>Status</h4>
        <dl class="dl-horizontal">
            <xsl:apply-templates />
        </dl>
    </xsl:template>

    <xsl:template match="spdom">
        <h4>Spatial Domain</h4>
        <dl class="dl-horizontal">
            <xsl:apply-templates />
        </dl>
    </xsl:template>

    <xsl:template match="keywords">
        <h4>Keywords</h4>
        <dl class="dl-horizontal">
            <xsl:apply-templates />
        </dl>
    </xsl:template>


    <!-- Spatial Data Organization Information -->
    <xsl:template match="indspref">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Indirect Spatial Reference'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="direct">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Direct Spatial Reference Method'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="sdtstype">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'SDTS Point and Vector Object Type'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="ptvctcnt">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Point and Vector Object Count'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="vpflevel">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'VPF Topology Level'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="vpftype">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'VPF Point and Vector Object Type'" />
        </xsl:call-template>
    </xsl:template>





    <!-- Entity and Attribute Information -->
    <xsl:template match="detailed">
        <xsl:apply-templates />
    </xsl:template>

    <xsl:template match="enttyp">
        <h4><xsl:value-of select="enttypl" /></h4>
        <xsl:apply-templates />
    </xsl:template>

    <xsl:template match="attr">
        <section>
            <h5><xsl:value-of select="attrlabl" /></h5>
            <div>
                <dl class="dl-horizontal">
                    <xsl:apply-templates />
                </dl>
            </div>
        </section>
    </xsl:template>

    <xsl:template match="attrdef">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Attribute Definition'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="attrdefs">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Attribute Definition Source'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="edom">
        <xsl:apply-templates />
    </xsl:template>

    <xsl:template match="edomv">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Enumerated Domain Value'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="edomvd">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Enumerated Domain Value Definition'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="edomvds">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Enumerated Domain Value Definition Source'" />
        </xsl:call-template>
    </xsl:template>



    <!-- Identification Information -->
    <xsl:template match="accconst">
        <xsl:call-template name="bare-description">
            <xsl:with-param name="term" select="'Access Constraints'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="useconst">
        <xsl:call-template name="bare-description">
            <xsl:with-param name="term" select="'Use Constraints'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="temporal/tempkt">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Temporal Keyword Thesaurus'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="temporal/tempkey">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Temporal Keyword'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="stratum/stratkey">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Stratum Keyword'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="stratum/stratkt">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Stratum Keyword Thesaurus'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="theme">
        <dt title="Theme Keywords">Theme Keywords</dt>
        <dd>
            <xsl:for-each select="themekey">
                <xsl:value-of select="." />
                <xsl:if test="position() != last()">
                    <xsl:text>; </xsl:text>
                </xsl:if>
            </xsl:for-each>
        </dd>
    </xsl:template>

    <xsl:template match="place">
        <dt title="Place Keywords">Place Keywords</dt>
        <dd>
            <xsl:for-each select="placekey">
                <xsl:value-of select="." />
                <xsl:if test="position() != last()">
                    <xsl:text>; </xsl:text>
                </xsl:if>
            </xsl:for-each>
        </dd>
    </xsl:template>

    <xsl:template match="westbc">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'West Bounding Coordinate'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="eastbc">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'East Bounding Coordinate'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="northbc">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'North Bounding Coordinate'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="southbc">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'South Bounding Coordinate'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="update">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Maintenance and Update Frequency'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="progress">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Progress'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="current">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Currentness Reference'" />
        </xsl:call-template>
    </xsl:template>

    <!-- Description parts -->
    <xsl:template match="abstract">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Abstract'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="purpose">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Purpose'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="supplinf">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Supplemental Information'" />
        </xsl:call-template>
    </xsl:template>

    <!-- Time period parts -->
    <xsl:template match="sngdate/caldate">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Calendar Date'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="sngdate/time">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Time of Day'" />
        </xsl:call-template>
    </xsl:template>

    <!-- Citation parts -->
    <xsl:template match="origin">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Originator'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="pubdate">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Publication Date'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="pubtime">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Publication Time'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="title">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Title'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="edition">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Edition'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="geoform">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Geospatial Data Presentation Form'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="serinfo/sername">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Series Name'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="serinfo/issue">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Issue Identification'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="pubinfo/pubplace">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Publication Place'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="pubinfo/publish">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Publiser'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="othercit">
        <xsl:call-template name="description">
            <xsl:with-param name="term" select="'Other Citation Details'" />
        </xsl:call-template>
    </xsl:template>

    <xsl:template match="onlink">
        <xsl:call-template name="description-link">
            <xsl:with-param name="term" select="'Online Linkage'" />
        </xsl:call-template>
    </xsl:template>


    <xsl:template name="description">
        <xsl:param name="term" />
        <xsl:if test="normalize-space(.) != ''">
            <dt title="{$term}"><xsl:value-of select="$term" /></dt>
            <dd><xsl:value-of select="." /></dd>
        </xsl:if>
    </xsl:template>

    <xsl:template name="bare-description">
        <xsl:param name="term" />
        <xsl:if test="normalize-space(.) != ''">
            <dl class="horizontal">
                <dt title="{$term}"><xsl:value-of select="$term" /></dt>
                <dd><xsl:value-of select="." /></dd>
            </dl>
        </xsl:if>
    </xsl:template>

    <xsl:template name="description-link">
        <xsl:param name="term" />
        <xsl:if test="normalize-space(.) != ''">
            <dt title="{$term}"><xsl:value-of select="$term" /></dt>
            <dd>
                <xsl:choose>
                    <xsl:when test="starts-with(normalize-space(.), 'http')">
                        <xsl:element name="a">
                            <xsl:attribute name="href">
                                <xsl:value-of select="." />
                            </xsl:attribute>
                            <xsl:value-of select="." />
                        </xsl:element>
                    </xsl:when>
                    <xsl:otherwise>
                        <xsl:value-of select="." />
                    </xsl:otherwise>
                </xsl:choose>
            </dd>
        </xsl:if>
    </xsl:template>



    <xsl:template match="text()"></xsl:template>

</xsl:stylesheet>