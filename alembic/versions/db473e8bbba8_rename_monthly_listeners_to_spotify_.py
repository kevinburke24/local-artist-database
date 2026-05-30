"""rename_monthly_listeners_to_spotify_followers

Revision ID: db473e8bbba8
Revises: 1101ba43871d
Create Date: 2026-05-30 19:11:40.060759

"""
from typing import Sequence, Union

from alembic import op

# revision identifiers, used by Alembic.
revision: str = 'db473e8bbba8'
down_revision: Union[str, Sequence[str], None] = '1101ba43871d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.alter_column('artists', 'monthly_listeners', new_column_name='spotify_followers')


def downgrade() -> None:
    op.alter_column('artists', 'spotify_followers', new_column_name='monthly_listeners')
