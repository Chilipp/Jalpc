{% assign all_skills = site.data.index.skills | concat: site.data.index.language_skills %}
{% assign all_projects = site.data.index.projects | concat: site.data.index.side_projects %}

var csShown = true;
var gsShown = true;
var csTableShown = false;
var gsTableShown = false;
var myRadarChart_cs, myRadarChart_gs;
var ctx_cs, ctx_gs;

window.addEventListener("load", function(){
    drawGsChart();
    drawCsChart();
});


function drawGsChart() {
    ctx_gs = document.getElementById("gs").getContext("2d");
    var data_gs = {
        labels: "{% for skill in site.data.index.skills %}{{ skill.name }}{% unless forloop.last %},{% endunless %}{% endfor %}".split(","),
        datasets: [{
            label: "Skill",
            fill: true,
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
            scales: {
                r: {
                    suggestedMin: 0,
                    suggestedMax: 100,
                    pointLabels: {
                        font: {
                            size: 16
                        }
                    }
                }
            },
            pointRadius: 5,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        footer: function (context) {
                            return numProjects(context[0].label);}
                    }
                }
            },
            title: {
                display: false,
                text: 'General skills'
            },
            onClick: (e, elements, chart) => {
                if (elements[0]) {
                    let i = elements[0].index;
                    switch2desc(chart.data.labels[i]);
                }
            }
        }
    });
}

function drawCsChart() {
    ctx_cs = document.getElementById("cs").getContext("2d");
    var data = {
        labels: "{% for skill in site.data.index.language_skills %}{{ skill.name }}{% unless forloop.last %},{% endunless %}{% endfor %}".split(","),
        datasets: [{
            label: "Coding skills",
            fill: true,
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
            scales: {
                r: {
                    suggestedMin: 0,
                    suggestedMax: 100,
                    pointLabels: {
                        font: {
                            size: 16
                        }
                    }
                }
            },
            pointRadius: 5,
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        footer: function(context) {
                            return numProjects(context[0].label);}
                    }
                }
            },
            title: {
                display: false,
                text: 'Programming languages'
            },
            onClick: (e, elements, chart) => {
                if (elements[0]) {
                    let i = elements[0].index;
                    switch2desc(chart.data.labels[i]);
                }
            }
        }
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
    return `
    Explicitly used in ${N} project${(N == 1 ? "" : "s")}. Click to see more.
    `;
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
                `<span data-i18n="[html]skill.{{ skill.i18n }}" id="skill-desc-gs-i18n">
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
            $("#skill-desc-gs-i18n").localize();
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
                `<span data-i18n="[html]language_skill.{{ skill.i18n }}" id="skill-desc-cs-i18n">
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
            $("#skill-desc-cs-i18n").localize();
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
