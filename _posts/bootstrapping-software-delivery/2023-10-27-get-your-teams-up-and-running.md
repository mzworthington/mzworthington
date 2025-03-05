---
layout: post
title:  Get your teams up and running
date:   2023-10-27 12:00:00 +0000
category: bootstrapping-software-delivery
image: /assets/2023-10-22-bootstrapping-software-delivery/boot.webp
tags:
  - Guides
  - Leadership
  - Getting started
code: https://github.com/mzworthington/setup/tree/master/scripts
---

Joining a new team is often painful and slow. Often you have to work out who to talk to, what software to install, request to be invited to meetings, hunt around for access to environments and repositories, and many more tasks. Without clear documentation, things will fall through the cracks giving vastly different onboarding experiences to new joiners. This post's goal is to streamline your JML process, delivering value faster.

<!--more-->

To maintain focus I will be making a few assumptions across this series. For this article, I assume that your product is well-defined, teams are positioned around bounded contexts and teams can work autonomously. Interactions outside the sub-products are intentional, keeping dependencies to a minimum.

I also assume that teams are cross-functional. All roles that are required to deliver the product are found within the teams. This varies from team to team; Some teams may need a data scientist or designer, and others may create headless services with complex infrastructure needs. Team shapes will flex over time depending on user needs, it is worth reviewing if your team shapes are optimal every few months to ensure everyone in the team is given the best opportunity to deliver value. When putting a team together I turn to [Team Topologies](https://teamtopologies.com/”). Identifying the style of the team is important, whether it be stream-aligned, enabling, complicated-sub-system, or platform team. This gives clarity inside and outside the team on what their role is and how they contribute to the organisation.

## The organisation

We take our knowledge for granted, once embedded in an organisation it is easy to assume we all have the same level of understanding and alignment. This makes onboarding tricky, a new joiner might have no idea what the organisation does, the products it creates, or the users it serves. Having a clear and concise wiki with a group understanding that it is in everyone's best interest to keep documentation up to date is important.

I've been a tech lead and a developer for the majority of my career, I brought my own bias when compiling this list and it is certainly not exhaustive. Below is my lean opinionated list of what I find useful when joining a new team.

### [Organisation or product elevator pitch](https://www.mindtools.com/aofwxxv/crafting-an-elevator-pitch)

What are we trying to achieve? Why are we here? We should all be equipped to answer these questions. If we can, we should remove this smell as a priority. We get the most out of people when everyone understands our purpose.

### [Up-to-date Lean Value Tree](https://www.thoughtworks.com/insights/blog/digital-transformation/how-to-brew-a-perfect-strategy-responsibly-part-one)

What is currently important? Why are we placing bets here? what is our Goal? These are important questions. There are so many ways to move the needle, we need to understand the direction we are going in and conversely what we are not exploring. New joiners bring a fresh perspective, bets and hypotheses should be visible and open to challenge. Being visible allows for rich debate with our teams.

### Brief description of all roles

Many of us have worked in our roles for long periods. We underestimate the knowledge we have. Our new joiner(s) might have no experience with these roles or have a different understanding of them. Defining our roles keeps us honest and aids alignment.

### Abbreviations & acronyms dictionaries/ Glossaries

The TLA (Three-letter acronym) plagues organisations. How much information can you give in 3 tiny letters? New joiners have enough to take on without having to guess what we are talking about. Your TLA’s might be obvious to you but might throw off new joiners. Would my mate down the pub know what I do if I read them our documentation? If not it needs improving. Documentation to explain the sub-sector, project, and organisation is a necessity.

### Product(s) overview and the personas they serve

We build products that people use. A new joiner may not be a persona we serve, they might not have heard of our product before. We need to convince them that what we are building is valuable as much as the personas we serve. Everyone in the team should be inspired to build the best product for our users and this starts with understanding who they are.

### Tech vision and Architecture, infrastructure & security principles

It is easy to say our teams are autonomous, but what does that mean? For me, autonomous teams are those that can deliver value to users mostly independently, they understand and work within the constraints of the organisation and are visible with their decisions. For this to work we must give teams clear and concise constraints for them to work within. Deciding on these principles is hard, there is a balance between setting the teams up for success and being overly constrictive, leading to delivery paralysis. A tech vision compliments these principles and tells the teams were we are going. More on these later.

## Within the Team

Having a well-defined set of Joiners/Movers/Leavers documentation will save the team time, give new joiners a brilliant first impression, and deliver value faster.

The organisation must know what each team does, what they are responsible for, and how they interact with other teams. The authors of Team Topologies produced a wonderful template for a [team API](https://github.com/TeamTopologies/Team-API-template). I use this template as the entry page for a team's dedicated documentation repository. It gives just the right level of information to new joiners and other teams.

### Team Topologies API

``` markdown
## Team API

Date:

* Team name and focus:
* Team type:
* Part of a Platform? (y/n) Details:
* Do we provide a service to other teams? (y/n) Details:
* What kind of Service Level Expectations do other teams have of us?
* Software owned and evolved by this team:
* Versioning approaches:
* Wiki search terms:
* Chat tool channels: #_____________ #_____________ #_____________
* Time of daily sync meeting:

> Team type: (Stream-Aligned, Enabling, Complicated Subsystem, Platform)

### What we're currently working on

* Our services and systems:
* Ways of working:
* Wider cross-team or organisational improvements:

### Teams we currently interact with

| Team name/focus | Interaction Mode | Purpose | Duration |
| --------------- | ---------------- | ------- | -------- |
| .               |                  |         |          |
| .               |                  |         |          |
| .               |                  |         |          |
| .               |                  |         |          |
| .               |                  |         |          |
| .               |                  |         |          |

> Team Interaction Modes: (Collaboration, X-as-a-Service, Facilitating)

### Teams we expect to interact with soon

| Team name/focus | Interaction Mode | Purpose | Duration |
| --------------- | ---------------- | ------- | -------- |
| .               |                  |         |          |
| .               |                  |         |          |
| .               |                  |         |          |
| .               |                  |         |          |
| .               |                  |         |          |
| .               |                  |         |          |


```

### Joiners

Joining a team is a task and should be considered as valuable as deliverying software. We dedicate real time to these activities which should be made visible and have an owner to ensure we give it the right level of attention. Create a story template to run across your board for every new starter.

Your documentation should cover the expectations of the new joiner and the required actions of their onboarding buddy. We know we have completed this task when our new joiner has access to everything they need and can add value independently. We should be able to answer yes to the following questions.

Has the new joiner been

* Invited to the email groups, calendar invites, IM channels, Wiki, source code and environments?
* Directed to information on the organisation, product, principles, vision, roadmap, board, team API and, team space?
* Invited to pair with members of the team?
* Assigned their first task?

It's important we get feedback from the buddy and the new joiner of their experience. The onboarding documentation and ticket template should be reviewed and refined often, with each new starter's objective to improve the onboarding of the next.

### Onboarding scripts

Developers tend to need a mountain of tools to get their local environment up and running. Ideally, we want to run our code in a similar environment to how it will be run, reducing it-works-on-my-machine issues. Aligning the team to the same tools and keeping them up to date will reduce risk. Our goal is to make onboarding a breeze. While our new starter is getting up to speed by reading guides, watching project context videos, familiarising themselves with the product, and socialising with their new team their machine is mostly sitting idle. Make the most of this time by providing an onboarding script(s) to get them going.

If you’re onboarding a developer or anyone who would like to get hands-on with the code you may want to consider an onboarding script.

Consider automating

* Installing tools, languages, frameworks, IDE’s
* Cloning all relevant code repositories
* Requesting access to environments

I have a couple of scripts that I find useful when setting up a new machine or updating my tools. These can be easily altered for your needs. The first pull down all relevant git repositories that I am currently working on, I run the script at least daily to pull down the latest changes, keeping my local repos up to date with the origin.

#### [Repo script](https://github.com/mzworthington/setup/blob/master/scripts/repos.sh)

```bash
#!/usr/bin/env bash
set -eu

readonly vcs_uri="git@${GITHUB_HOST:-github.com}:"
readonly script_dir="$(dirname "${0}")/../.."
readonly -a projects=(
# List your github repos here "userId/repo", e.g "mzworthington/setup"
)

function fetch() {
  local -r project="${1}"
  if project_exists "${project}"
  then
    echo -e "\nUpdating ${project}:" 1>&2
    git -C "${script_dir}/${project}" pull --rebase --autostash
  else
    echo 1>&2
    local -r group=$(dirname $project)
    mkdir -p "${script_dir}/${group}"
    git -C "${script_dir}/${group}" clone "${vcs_uri}/${project}"
  fi
}

function project_exists() {
  echo "${script_dir}/${1}"
  [[ -d "${script_dir}/${1}" ]]
}

function main() {
  echo 'Fetching projects...' 1>&2
  for project in "${projects[@]}"
  do
    fetch "${project}"
  done
}

main "$@"
```

#### [Software Script](https://github.com/mzworthington/setup/blob/master/bootstrap/bootstrap.sh)

I use a Mac with [Homebrew](https://brew.sh/) as my package manager. If you find yourself in a team of Mac users this script could be useful. I tend to create a repo for common tools and scripts, however different teams have their own toolset. When the teams toolsets start to evole I encourage the teams to have their own Brewfile within their repos. This gives the teams visibility of all the tools used within the products and feeds into the wider technology register for the organisation. Keeping this in source code allows everyone to easily keep their software up-to-date and consistent across the team.

```bash
#!/bin/sh

set -e

cd "$(dirname "$0")/"

if [ -f "Brewfile" ] && [ "$(uname -s)" = "Darwin" ]; then
  echo ""
  echo ""
  echo 🕰 This might take some time 🕰
  echo 🫖 Make yourself a brew 🫖
  echo 😴 Put your feet up 🛀 
  echo ""
  echo ""
  echo "==> Installing Homebrew dependencies…"

  brew bundle check >/dev/null 2>&1 || brew bundle

  echo ""
  echo ""
  echo 💿 You\'re all set 💿
fi

echo ""
echo ""
echo 🎉🎉🎉YAAAAS! Lets get coding 🎉🎉🎉
echo "Run the following command to add repo script and pairing script to your path."
echo "Then reset your terminal session to access the scripts"
echo ""
echo "echo 'export PATH=$(pwd)/../scripts:\$PATH' >> ~/.zshrc"
echo ""
```

### Moving and leaving the team

Leaving or moving from the team opens up a security risk. We mitigate this risk by having a well defined leavers and movers plan documented. We should run these tasks in the same way as our onboarding documentation, they should be tracked on our board and we should gather feedback on the process post completion.

***

I hope this has given you some ideas on how we can remove friction during onboarding and increase visibility of our roles, responsibilities, values and goals across the organisation. Next time I’ll be diving into ways of working sensible defaults.
