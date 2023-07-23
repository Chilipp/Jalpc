{% assign all_skills = site.data.index.skills | concat: site.data.index.language_skills %}
{% assign all_projects = site.data.index.projects | concat: site.data.index.side_projects %}

var csShown = true;
var gsShown = true;
var csTableShown = false;
var gsTableShown = false;
var myRadarChart_cs, myRadarChart_gs;
var ctx_cs, ctx_gs;

$(document).ready(function(){
    drawGsChart();
    drawCsChart();
});


function drawGsChart() {
    ctx_gs = document.getElementById("gs").getContext("2d");
    var data_gs = {
        labels: "{% for skill in site.data.index.skills %}{{ skill.name }}{% unless forloop.last %},{% endunless %}{% endfor %}".split(","),
        datasets: [{
            label: "Skill",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "#3385FF",
            pointBackgroundColor: "#3385FF",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#3385FF",
            pointHoverBorderColor: "#3385FF",
            data: [{% for skill in site.data.index.skills %}{{ skill.percentage }}{% unless forloop.last %}, {% endunless %}{% endfor %}]
            }]
    };
    myRadarChart_gs = new Chart(ctx_gs, {
        type: 'radar',
        data: data_gs,
        options: {
            scale: {
                responsive: true,
                ticks: {min: 0, max: 100},
                lineArc: false,
                pointLabels: {fontSize: 14},
            },
            legend: {display: false},
            title: {
                display: false,
                text: 'General skills'
            },
            tooltips: {
                callbacks: {
                    footer: function(items, data) {
                        return numProjects(data.labels[items[0].index]);}
                }
            }
        }
    });

    $('#gs').click(function (e) {
        onLabelClick(e, myRadarChart_gs, ctx_gs)
    });
}

function drawCsChart() {
    ctx_cs = document.getElementById("cs").getContext("2d");
    var data = {
        labels: "{% for skill in site.data.index.language_skills %}{{ skill.name }}{% unless forloop.last %},{% endunless %}{% endfor %}".split(","),
        datasets: [{
            label: "Coding skills",
            backgroundColor: "rgba(179,181,198,0.2)",
            borderColor: "#3385FF",
            pointBackgroundColor: "#3385FF",
            pointBorderColor: "#fff",
            pointHoverBackgroundColor: "#3385FF",
            pointHoverBorderColor: "#3385FF",
            data: [{% for skill in site.data.index.language_skills %}{{ skill.percentage }}{% unless forloop.last %}, {% endunless %}{% endfor %}]
            }]
    };

    myRadarChart_cs = new Chart(ctx_cs, {
        type: 'radar',
        data: data,
        options: {
            scale: {
                responsive: true,
                ticks: {min: 0, max: 100},
                lineArc: false,
                pointLabels: {fontSize: 14},
            },
            legend: {display: false},
            title: {
                display: false,
                text: 'Programming languages'
            },
            tooltips: {
                callbacks: {
                    footer: function(items, data) {
                        return numProjects(data.labels[items[0].index]);}
                }
            }
        }
    });

    $('#cs').click(function (e) {
    	onLabelClick(e, myRadarChart_cs, ctx_cs)
    });
}


function numProjects(skill) {
    N = 0;
    switch (skill) {
        {% for skill in all_skills %}
        case "{{ skill.name }}": {
            {% for project in all_projects %}
                {% if project.skills contains skill.name %}
                N += 1;
                {% endif %}
            {% endfor %}
            break;
        }
        {% endfor %}

    }
    return "Explicitly used in " + N + " project" + (N == 1 ? "" : "s") + ".";
}


function switch2desc(skill) {
    switch(skill) {
        case "All skills": {
            document.getElementById('skill-name-gs').innerHTML = skill + ' <span class="caret"></span>';
            document.getElementById('skill-desc-gs').innerHTML = "";
            $("#table-gs").show();
            switch2skillGs();
            break;
        }
        {% for skill in site.data.index.skills %}
        case "{{ skill.name }}": {
            document.getElementById('skill-name-gs').innerHTML = skill + ' <span class="caret"></span>';
            document.getElementById('skill-desc-gs').innerHTML = (
                `<span data-i18n="[html]skill.{{ skill.i18n }}">
                  {% if skill.desc.en %}{{ skill.desc.en | markdownify }}{% else %}{{ skill.desc | markdownify }}{% endif %}
                </span><br><br>
                <ul class='list-inline dotted-items desc-items'>
                <li><span>Projects</span></li>
                {% for project in all_projects %}
                {% if project.skills contains skill.name %}
                <li><span>
                {% if project.img_link %}
                <a title="{{ project.img_title }}" href="{{ project.img_link }}" target="_blank">
                {% elsif project.url %}
                <a title="{{ project.img_title }}" href="{{ project.url }}" target="_blank">
                {% elsif project.repo %}
                {% if project.gh_user %}
                    <a href="https://github.com/{{ project.gh_user }}/{{ project.repo }}" target="_blank">
                {% elsif project.codebase_user %}
                    <a href="https://codebase.helmholtz.cloud/{{ project.codebase_user }}/{{ project.repo }}" target="_blank">
                {% endif %}
                {% endif %}
                {{ project.name }}
                {% if project.img_link or project.url or project.repo %}</a> {% endif %}
                </span></li>
                {% endif %}
                {% endfor %}
                </ul>
                {% if skill.seealso %}
                <ul class='list-inline dotted-items desc-items'>
                <li><span>See also</span></li>
                {% for other in skill.seealso %}
                <li><span><a href="javascript:switch2desc('{{ other }}')">{{ other }}</a></span></li>
                {% endfor %}
                </ul>
                {% endif %}
                <button class="btn btn-default" onclick="switch2desc('All skills')" title="Back to overview table"><i class="fas fa-chevron-circle-left"></i> All skills</button>`
            );
            $("#table-gs").hide();
            switch2skillGs();
            break;
        }
        {% endfor %}
        case "All languages": {
            document.getElementById('skill-name-cs').innerHTML = skill + ' <span class="caret"></span>';
            document.getElementById('skill-desc-cs').innerHTML = "";
            $("#table-cs").show();
            switch2skillCs();
            break;
        }
        {% for skill in site.data.index.language_skills %}
        case "{{ skill.name }}": {
            document.getElementById('skill-name-cs').innerHTML = skill + ' <span class="caret"></span>';
            document.getElementById('skill-desc-cs').innerHTML = (
                `<span data-i18n="[html]language_skill.{{ skill.i18n }}">
                  {% if skill.desc.en %}{{ skill.desc.en | markdownify }}{% else %}{{ skill.desc | markdownify }}{% endif %}
                </span><br><br>
                <ul class='list-inline dotted-items desc-items'>
                <li><span>Projects</span></li>
                {% for project in all_projects %}
                {% if project.skills contains skill.name %}
                <li><span>
                {% if project.img_link %}
                <a title="{{ project.img_title }}" href="{{ project.img_link }}" target="_blank">
                {% elsif project.url %}
                <a title="{{ project.img_title }}" href="{{ project.url }}" target="_blank">
                {% elsif project.repo %}
                {% if project.gh_user %}
                    <a href="https://github.com/{{ project.gh_user }}/{{ project.repo }}" target="_blank">
                {% elsif project.codebase_user %}
                    <a href="https://codebase.helmholtz.cloud/{{ project.codebase_user }}/{{ project.repo }}" target="_blank">
                {% endif %}
                {% endif %}
                {{ project.name }}
                {% if project.img_link or project.url or project.repo %}</a> {% endif %}
                </span></li>
                {% endif %}
                {% endfor %}
                </ul>
                {% if skill.seealso %}
                <ul class='list-inline dotted-items desc-items'>
                <li><span>See also</span></li>
                {% for other in skill.seealso %}
                <li><span><a href="javascript:switch2desc('{{ other }}')">{{ other }}</a></span></li>
                {% endfor %}
                </ul>
                {% endif %}
                <button class="btn btn-default" onclick="switch2desc('All languages')" title="Back to overview table"><i class="fas fa-chevron-circle-left"></i> All languages</button>`
            );
            $("#table-cs").hide();
            switch2skillCs();
            break;
        }
        {% endfor %}
    }

};

function switch2skillGs() {
    $('#gs-tabs a[href="#skill-gs"]').tab('show');

    var elm = $('#skill-gs');
    gsShown = false;
    gsTableShown = false;

    if (!isElementInViewport(elm[0])) {
        elm[0].scrollIntoView(false);
    }
}

function switch2skillCs() {
    $('#cs-tabs a[href="#skill-cs"]').tab('show');
    csShown = false;
    csTableShown = false;

    var elm = $('#skill-cs');

    if (!isElementInViewport(elm[0])) {
        elm[0].scrollIntoView(false);
    }
}

function switch2cs(){
    $('#cs-tabs a[href="#container_cs"]').tab('show');

    csShown = true;
    csTableShown = false;
};

function switch2csTable(){
    $('#cs-tabs a[href="#skill-cs-table"]').tab('show');

    csShown = false;
    csTableShown = true;
};

function switch2gs(){
    $('#gs-tabs a[href="#container_gs"]').tab('show');

    gsShown = true;
    gsTableShown = false;
};

function switch2gsTable(){
    switch2desc("All skills");
};

function onLabelClick(e, myRadarChart, ctx) {
    /* show skill description when clicking on a label. */
    /* based on https://stackoverflow.com/a/37057097 */
    var helpers = Chart.helpers;

    var eventPosition = helpers.getRelativePosition(e, myRadarChart.chart);
    var mouseX = eventPosition.x;
    var mouseY = eventPosition.y;

    var activePoints = [];
    helpers.each(myRadarChart.scale.ticks, function (label, index) {
        for (var i = myRadarChart.data.labels.length - 1; i >= 0; i--) {
            var pointLabelPosition = this.getPointPosition(i, this.getDistanceFromCenterForValue(this.options.reverse ? this.min : this.max) + 5);

            var pointLabelFontSize = helpers.getValueOrDefault(this.options.pointLabels.fontSize, Chart.defaults.global.defaultFontSize);
            var pointLabeFontStyle = helpers.getValueOrDefault(this.options.pointLabels.fontStyle, Chart.defaults.global.defaultFontStyle);
            var pointLabeFontFamily = helpers.getValueOrDefault(this.options.pointLabels.fontFamily, Chart.defaults.global.defaultFontFamily);
            var pointLabeFont = helpers.fontString(pointLabelFontSize, pointLabeFontStyle, pointLabeFontFamily);
            ctx.font = pointLabeFont;

            var labelsCount = this.pointLabels.length,
                halfLabelsCount = this.pointLabels.length / 2,
                quarterLabelsCount = halfLabelsCount / 2,
                upperHalf = (i < quarterLabelsCount || i > labelsCount - quarterLabelsCount),
                exactQuarter = (i === quarterLabelsCount || i === labelsCount - quarterLabelsCount);
            var width = ctx.measureText(this.pointLabels[i]).width;
            var height = pointLabelFontSize;

            var x, y;

            if (i === 0 || i === halfLabelsCount){
                x = pointLabelPosition.x - width / 2;
            } else if (i < halfLabelsCount){
                x = pointLabelPosition.x;
            } else{
                x = pointLabelPosition.x - width;
            }
            if (exactQuarter){
                y = pointLabelPosition.y - height / 2;
            } else if (upperHalf){
                y = pointLabelPosition.y - height;
            } else {
                y = pointLabelPosition.y
            }

            if ((mouseY >= y && mouseY <= y + height) && (mouseX >= x && mouseX <= x + width)){
                activePoints.push({ index: i, label: this.pointLabels[i] });}
        }
    }, myRadarChart.scale);

    var firstPoint = activePoints[0];
    if (firstPoint !== undefined) {
        switch2desc(firstPoint.label);
    }
};

function isElementInViewport (el) {
    /* based on https://stackoverflow.com/a/7557433 */
    /* special bonus for those using jQuery */
    if (typeof jQuery === "function" && el instanceof jQuery) {
        el = el[0];
    };

    var rect = el.getBoundingClientRect();

    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /*or $(window).height() */
        rect.right <= (window.innerWidth || document.documentElement.clientWidth) /*or $(window).width() */
    );
};
