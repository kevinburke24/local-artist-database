"""add instruments column to artists and artist_submissions

Revision ID: f1a2b3c4d5e6
Revises: e2f3a4b5c6d7
Create Date: 2026-06-02 00:00:00.000000

"""
from typing import Sequence, Union
from alembic import op
import sqlalchemy as sa

revision: str = 'f1a2b3c4d5e6'
down_revision: Union[str, Sequence[str], None] = 'e2f3a4b5c6d7'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column('artists', sa.Column('instruments', sa.Text(), nullable=True))
    op.add_column('artist_submissions', sa.Column('instruments', sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column('artist_submissions', 'instruments')
    op.drop_column('artists', 'instruments')
